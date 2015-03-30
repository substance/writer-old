# Writer

The Substance Writer component is intendet to be a framework for editor development. A writer can be customized easily using extensions (panels, tools, node types) that operate on a defined interface, the Writer API to control the custom editor's behavior.

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

*Note: There can be different kinds of selections. E.g. if content in a container is selected the annotation could span ver multiple nodes. TODO: define different behaviors depending on what is selected. Easiest implementation for now: only allow single-node annotations.*


## Cursor and selection (within a single text node!)

There are many different scenarios of where the selection could be, but for now we want to expose one generic selection API that is scoped to one text element. Note that this selection will be invalid if you have selected multiple nodes in a container element. However it will work 

`NodeSelection` API (or TextPropertySelection ?)

```js
var sel = writer.getSelection();
sel.getPath(); // -> ["text_24", "content"]
sel.getRange(); // -> [34, 12]
sel.getText(); // returns text of what is selected
```

You can also modify that selection:

```js
sel.collapse();
sel.expandRight(1);
```

`ContainerSelection` API

When used in a container, we need to use a more complex selection object. e.g. we need to model when a selection spans over multiple nodes.

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
          $$(TextProperty, {doc: this.props.doc, path: ["document", "biography"])
        )
      )
    );
  }
```

