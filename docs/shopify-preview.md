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
