# Writer

The Substance Writer component is intendet to be a framework for editor development. A writer can be customized easily using extensions (panels, tools, node types) that operate on a defined interface the Writer API to control the custom editor's behavior.

## Writer API

The Writer API is a work in progress and subject to change.

## Create annotations

Checks if there's a valid selection and creates an annotation object. The UI will update automatically after the operation has been applied.

```js
var newAnnotation = writer.createAnnotation({
  id: "entity_reference_25", // optional (a unique id will be generated if not provided)
  type: "entity_reference",
  target: "entity_14"
});
```

Deleting existing annotations is easy too.

```js
writer.deleteAnnotation("entity_reference_25");
```

**Note: There can be different kinds of selections. E.g. if content in a container is selected the annotation could span ver multiple nodes. TODO: define different behaviors depending on what is selected. Easiest implementation for now: only allow single-node annotations.**

## Managing state

Extension can introduce custom state configuration. E.g. if you introduce a new panel for managing entities associated with the document, you would use a new value for contextId to model it.

You can enter your custom state by calling:

```
writer.replaceState({
  contextId: 'entities'
});
```

You extension must now handle that new state, e.g. by creating an instance of a new custom panel:


```js
  // from extensions/entities/stateHandlers.js
  handleContextPanelCreation: function(writer) {
    var s = writer.state;

    if (s.contextId === "entities") {
      return $$(EntitiesPanel, {
        writer: writer,
      });
    }
  },
```
