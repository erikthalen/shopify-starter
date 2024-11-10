# Shopify preview

Used to force Shopify Customiser to render a preview in the section popup
with a screenshot of the section.

The need for this snippet feels like a bug in Shopify.
It seems that a section needs a placeholder_svg_tag wrapped in a div
for the new-section-popup to not just render a text saying "No preview available"..

Use it by rendering this snippet in all your sections:

```liquid
{% render '_shopify-preview' %}
```

And add default content/values to your section settings,
as well as default blocks in the "preview" section of the schema.

### Example

```liquid {11}
<h1>{{ section.settings.title }}</h1>

{% schema %}
{
  "name": "Title section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "This is a title"
    }
  ],
  "presets": [
    {
      "name": "Title section"
    }
  ]
}
{% endschema %}
```

Because of the `"default"`, you would think this section would render in the Shopify Customiser preview. But it doesn't.

But when including the `_shopify-preview` it does work as expected:

```liquid {3}
<h1>{{ section.settings.title }}</h1>

{% render '_shopify-preview' %}

{% schema %}
{
  "name": "Title section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "This is a title"
    }
  ],
  "presets": [
    {
      "name": "Title section"
    }
  ]
}
{% endschema %}
```