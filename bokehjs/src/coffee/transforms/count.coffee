define [
  "common/continuum_view"
  "backbone",
  "common/has_parent"
], (ContinuumView, Backbone, HasParent) ->

  class CountView extends ContinuumView
    attributes:
      class: "CountView"

    initialize: (options) ->
      super(options)
      @render_init()

    delegateEvents: (events) ->
      super(events)
      "pass"

    render_init: () ->
      @$el.html("")

  class Count extends HasParent
    type : "Count"
    default_view: CountView

  class Counts extends Backbone.Collection
    model : Count

  return {
    "Model" : Count
    "Collection" : new Counts()
  }
