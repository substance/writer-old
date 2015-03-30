# Writer

The Substance Writer component is intendet to be a framework for editor development. A writer can be customized easily using extensions (panels, tools, node types) that operate on a defined interface, the Writer API to control the custom editor's behavior.

## Writer API

*Note: The Writer API is a work in progress and subject to change.*

## Create annotations

Checks if there's a valid selection and creates an annotation object. The UI will update automatically after the operation has been applied.

Create a strong annotation.

```js
var newAnnotation = writer.createAnnotation({
  id: "strong_12", // optional (a unique id will be generated if not provided)
  type: "strong"
});
```

Create a custom reference annotation

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

*Note: This only works for valid Text Selections. That means that if you have a selection within a container that spans over multiple text nodes or other things `createAnnotation` will throw an exception.*


## Selection API

There are many different scenarios of where the selection could be, but for now we want to expose one generic selection API that is scoped to one text element. 

### Text Selection API

Describes a single selection within a text property editor.

```js
var sel = writer.getTextSelection();
sel.getPath(); // -> ["text_24", "content"] -> path to a text property
sel.getRange(); // -> [34, 12] -> 
sel.getText(); // returns text of what is selected
sel.getActiveAnnotations(); ["strong", ""] // returns annotations that are at least partially overlapping with current text selection
```

* Note: This selection will be invalid if you have selected multiple nodes in a container element.*

You can also modify that selection:

```js
sel.collapse();
sel.expandRight(1);
// Manipulation API to be discussed.
```

### Container Selection API

When used in a container, we need to use a more complex selection object. e.g. we need to model when a selection spans over multiple nodes.

```js
var cSel = writer.getContainerSelection();
```

*Note: If your selection is not wrapped in a container, `writer.getContainerSelection` will return null.*

TODO: document contaienr selection API.

## Managing state

Extension can introduce custom state configuration. E.g. if you introduce a new panel for managing entities associated with the document, you would use a new value for contextId to model it.

You can enter your custom state by calling:

```js
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

Also you can determine what should be highlighted in the content panel's scrollbar by deriving it from the current state

```js
getHighlightedNodes: function(writer) {
  var state = writer.state;
  var doc = writer.doc;
  
  if (state.contextId === "entities" && state.entityId) {
    var references = Object.keys(doc.references.get(state.subjectId));
    return references;
  }
};
```


## Usage Examples

Usage of a text property in a custom info panel. Makeing a field editable and annotatable property is as easy as delegating work to a TextProperty component instantiating with a doc and a path to a string property.

```js
  render: function() {
    return $$("div", { className: "metadata-panel panel" },
      $$("div", {className: "panel-content"},
        $$('div', {className: "biography"},
          $$('div', {className: 'label'}, "Biography"),
          $$(TextProperty, {doc: this.props.doc, path: ["document", "biography"]})
        )
      )
    );
  }
```

## Realizations

- Substance.Document should not include view-relevant code
  - Currently the Container Implementation is tangled with view stuff (Surfaces and Node Views)
  - Functionality should be moved into Writer module
- Simple scoped Text API's (`TextSelection`, `TextAnnotation`) suitable for many basic (form-based) editing scenarios.
- More complex Container API (`ContainerSelection`, `ContainerAnnotation` -> speaking multi-node-annotations)
  - Container editing behavior is specified close to container implementation
    - E.g. ContentContainer editor could should specify which nodes it supports and how it handles edge cases, like braking and joining nodes etc. we should be able to make two different container editor implementations, with a different set of nodes and a different behavior for breaking etc. I think we should not put too much detail into the bare node implementations, to keep them reusable.
    - Question: When a node (like figure) has components (title, caption), isn't this pretty much like a container? Maybe we could solve the same problem by allowing nested container nodes. Or let's call it composite nodes vs leaf nodes. Anyway something like a figure is structured in a defined way, while a containers primary behavior is managing a list of nodes that can be shuffled individually
