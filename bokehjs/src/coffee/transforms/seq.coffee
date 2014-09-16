define [
  "common/continuum_view"
  "backbone",
  "common/has_parent",
], (ContinuumView, Backbone, HasParent) ->

  class SeqView extends ContinuumView
    attributes:
      class: "SeqView"

    initialize: (options) ->
      super(options)
      @render_init()

    delegateEvents: (events) ->
      super(events)
      "pass"

    render_init: () ->
      @$el.html("")

  class Seq extends HasParent
    type : "Seq"
    default_view: SeqView

  class Seqs extends Backbone.Collection
    model : Seq

  return {
    "Model" : Seq
    "Collection" : new Seqs()
  }
