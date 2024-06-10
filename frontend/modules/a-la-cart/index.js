import { debounce } from "./utils";

function defaultParser(form) {
  const formData = new FormData(form);
  const [id] = formData.getAll("id");
  const quantity = parseInt(formData.getAll("quantity") || 1);

  return {
    items: [{ id, quantity }],
  };
}

function setUrlParam(key, value, useBarbaNavigation) {
  if (useBarbaNavigation) {
    // can't be used together with barba
    // barba.history.add(url.href, 'popstate', 'replace')
    // barba.history.remove()
    return;
  }

  const url = new URL(window.location.href);

  if (value === null) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.replaceState({}, null, url);
}

function redirect(to, useBarbaNavigation) {
  if (useBarbaNavigation) {
    return;
  }

  window.location.replace(to);
}

function dispatchLoadingEvent(loadingState) {
  window.dispatchEvent(
    new CustomEvent("a-la-cart.is-updating", { detail: loadingState }),
  );
}

async function fetchShopifyPage(url, { signal, cache = true } = {}) {
  const parser = new DOMParser();
  const res = await fetch(`${url}${cache ? "?cache=false" : ""}`, { signal });
  return parser.parseFromString(await res.text(), "text/html");
}

function replaceDom(newDocument, selector) {
  const oldCart = document.body.querySelector(selector);
  const newCartContainer = newDocument.querySelector(selector);

  oldCart.after(newCartContainer);
  oldCart.remove();

  window.dispatchEvent(new CustomEvent("a-la-cart.cart-updated"));

  return newCartContainer;
}

const debouncedUpdateCartFetch = debounce(async (body, { signal }) => {
  dispatchLoadingEvent(true);

  await fetch("/cart/update.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // signal,
    body: JSON.stringify(body),
  });

  const newCart = await fetchShopifyPage("/cart", { signal });

  dispatchLoadingEvent(false);

  return newCart;
}, 200);

function updateCartOnCartChange(root, cartSectionSelector, cartForm) {
  const cartChangeAbortController = new AbortController();

  return new Promise((resolve) => {
    cartForm.addEventListener(
      "change",
      async (e) => {
        if (e.target.name === "updates[]") {
          try {
            // both update cart and get new cart markup back
            const newCartPageDocument = await debouncedUpdateCartFetch({
              updates: { [e.target.id]: parseInt(e.target.value) },
            });

            const newCartContainer = replaceDom(
              newCartPageDocument,
              cartSectionSelector,
            );

            cartChangeAbortController.abort();
            resolve(newCartContainer);
          } catch (error) {
            dispatchLoadingEvent(false);
          }
        }
      },
      { signal: cartChangeAbortController.signal },
    );

    const links = [...cartForm.querySelectorAll("a")];

    // any/all remove buttons
    links
      .filter((link) => link.href.includes("cart/change"))
      .forEach((link) => {
        link.addEventListener(
          "click",
          async (e) => {
            e.preventDefault();
            e.stopPropagation();

            dispatchLoadingEvent(true);

            // do the removing
            await fetch(link.href);

            const newCart = await fetchShopifyPage("/cart", { cache: false });

            const newCartContainer = replaceDom(newCart, cartSectionSelector);

            dispatchLoadingEvent(false);

            cartChangeAbortController.abort();
            resolve(newCartContainer);
          },
          { signal: cartChangeAbortController.signal },
        );
      });
  });
}

async function addToCart(data) {
  try {
    const res = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    window.dispatchEvent(
      new CustomEvent("a-la-cart.product-added", { detail: await res.json() }),
    );
  } catch (error) {
    console.log(`Couldn't add to card: `, error);
  }
}

// runs itself again, when the markup changes
async function listenAndUpdateRecursive(root, cartSectionSelector, cartForm) {
  const newCartForm = await updateCartOnCartChange(
    root,
    cartSectionSelector,
    cartForm,
  );
  listenAndUpdateRecursive(root, cartSectionSelector, newCartForm);
}

let prefetches = new Map();

async function fetchAndOpenDrawerCart(
  root,
  cartSectionSelector,
  drawerContainer,
) {
  const cartPage = await (prefetches.get("/cart") || fetchShopifyPage("/cart"));

  // remove old cart
  drawerContainer.querySelector(cartSectionSelector)?.remove();

  const cart = cartPage.querySelector(cartSectionSelector);
  drawerContainer.append(cart);

  listenAndUpdateRecursive(
    root,
    cartSectionSelector,
    cart?.querySelector("form"),
  );
}

function closeDrawer(cartSectionSelector, drawerContainer, useBarbaNavigation) {
  drawerContainer.querySelector(cartSectionSelector)?.remove();
  setUrlParam("cart", null, useBarbaNavigation);
}

let teardownController = null;

export default async ({
  root = document.body,
  useBarbaNavigation = false,
  cartSectionSelector = ".main-cart",
  productFormSelector = ".shopify-product-form",
  productFormParser, // https://shopify.dev/docs/api/ajax/reference/cart
  drawerContainer,
} = {}) => {
  // remove any old loading listeners
  // if this function is run twice
  teardownController?.abort();
  teardownController = new AbortController();

  const drawerElement = drawerContainer
    ? typeof drawerContainer === "string"
      ? document.body.querySelector(drawerContainer)
      : drawerContainer
    : null;

  if (drawerElement) {
    closeDrawer(cartSectionSelector, drawerElement, useBarbaNavigation);

    const url = new URL(window.location);

    if (url.pathname === "/cart") {
      redirect("/?cart", useBarbaNavigation);
    }

    if (url.searchParams.has("cart")) {
      await fetchAndOpenDrawerCart(root, cartSectionSelector, drawerElement);
      window.dispatchEvent(new CustomEvent("a-la-cart.drawer-opened"));
    }

    const cartLinks = root.querySelectorAll('a[href="/cart"]');

    cartLinks.forEach((link) => {
      link?.addEventListener(
        "pointerenter",
        () => prefetches.set("/cart", fetchShopifyPage("/cart")),
        { signal: teardownController.signal },
      );

      link?.addEventListener(
        "pointerleave",
        () => prefetches.set("/cart", null),
        { signal: teardownController.signal },
      );

      link?.addEventListener(
        "click",
        async (e) => {
          e.preventDefault();
          e.stopPropagation();
          setUrlParam("cart", "", useBarbaNavigation);
          await fetchAndOpenDrawerCart(
            root,
            cartSectionSelector,
            drawerElement,
          );
          window.dispatchEvent(new CustomEvent("a-la-cart.drawer-opened"));
        },
        { signal: teardownController.signal },
      );
    });

    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Escape") return;
        closeDrawer(cartSectionSelector, drawerElement, useBarbaNavigation);
      },
      {
        signal: teardownController.signal,
      },
    );
  }

  const cartSection = root.querySelector(cartSectionSelector);

  if (window.location.pathname === "/cart" && cartSection) {
    listenAndUpdateRecursive(
      root,
      cartSectionSelector,
      cartSection.querySelector("form"),
    );
  }

  const productForm = root.querySelector(productFormSelector);

  if (productForm && productForm.tagName !== "FORM") {
    console.warn("a-la-cart needs a form element, received: ", productForm);
  }

  if (productForm) {
    const parse =
      typeof productFormParser === "function"
        ? productFormParser
        : defaultParser;

    productForm.addEventListener(
      "change",
      () =>
        setUrlParam(
          "variant",
          parse(productForm).items[0].id,
          useBarbaNavigation,
        ),
      { signal: teardownController.signal },
    );

    productForm.addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();
        await addToCart(parse(productForm));
      },
      { signal: teardownController.signal },
    );
  }

  /**
   * external events
   */
  window.addEventListener(
    "a-la-cart.open-drawer",
    async () => {
      await fetchAndOpenDrawerCart(root, cartSectionSelector, drawerElement);
      window.dispatchEvent(new CustomEvent("a-la-cart.drawer-opened"));
    },
    {
      signal: teardownController.signal,
    },
  );
  window.addEventListener(
    "a-la-cart.close-drawer",
    () => closeDrawer(cartSectionSelector, drawerElement, useBarbaNavigation),
    {
      signal: teardownController.signal,
    },
  );
};
