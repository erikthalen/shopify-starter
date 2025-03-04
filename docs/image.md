# Image

Used to render images.

## Example usage

```liquid
{% render 'image', image: product.featured_image %}
```

```liquid
{% render 'image',
  image: section.settings.image,
  sizes: '100vw, 50vw',
  aspect_ratio: '1/1',
  class: 'opacity-30'
%}
```

```liquid
{% render 'image',
  image: section.settings.image,
  image_mobile: section.settings.image_mobile,
  aspect_ratio_sm: '3/4',
  aspect_ratio_md: '16/9'
%}
```

## API

#### image

- **Type:** `ImageDrop`
- **Default:** `null`

The Shopify image object,

#### image_mobile

- **Type:** `ImageDrop`
- **Default:** `null`

Optionally another image for mobile

#### sizes

- **Type:** `String`
- **Default:** `'100vw, 100vw'`

Value for the `<img sizes="">` attribute. First value is size on mobile, second is for desktop.

#### loading

- **Type:** `String`
- **Default:** `'lazy'`

Sets loading attribute, defaults to "lazy"

#### aspect_ratio

- **Type:** `String`
- **Default:** `null`

CSS string defining aspect ratio. Use this if the image should be cropped.

#### aspect_ratio_sm

- **Type:** `String`
- **Default:** `null`

CSS string defining aspect ratio on small screens (overwrites aspect_ratio)

#### aspect_ratio_md

- **Type:** `String`
- **Default:** `null`

CSS string defining aspect ratio on large screens (overwrites aspect_ratio)

#### class

- **Type:** `String`
- **Default:** `null`

Any classes to apply to the "picture"

#### style

- **Type:** `String`
- **Default:** `null`

Any inline style to apply to the "picture"
