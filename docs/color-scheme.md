# Color scheme

Used to output a color scheme as inline css variables.

Loops through all/any colors defined in the current scheme of a section

## Usage

```liquid
<div style='{% render 'color-scheme' %}'>...</div>

{% schema %}
{
  "name": "Test section",
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Color Scheme",
      "default": "scheme_1"
    }
  ]
}
{% endschema %}
```

Defaults to finding a scheme under the key `section.settings.color_scheme`. Overwrite this with `color_scheme`:

```liquid
<div
  style='{% render 'color-scheme', color_scheme: block.settings.my_scheme %}'
></div>
```
