define [
  "common/has_parent",
  "common/continuum_view",
  "common/build_views"
  "backbone"
], (HasParent, ContinuumView, build_views, Backbone) ->

  class VBoxFormView extends ContinuumView
    tagName : "form"
    attributes:
      class : "bk-widget-form"
      role : "form"

    initialize : (options) ->
      super(options)
      @views = {}
      @render()

    render: () ->
      children = @mget('children')
      build_views(@views, children)
      for own key, val of @views
        val.$el.detach()
      @$el.empty()
      for child in children
        @$el.append("<br/")
        @$el.append(@views[child.id].$el)

  class VBoxForm extends HasParent
    type : "VBoxForm"
    default_view : VBoxFormView
    defaults: ->
      _.extend {}, super(), {
        children: []
      }

  class VBoxForms extends Backbone.Collection
    model : VBoxForm
  vboxforms = new VBoxForms()
  return {
    "Model" : VBoxForm
    "Collection" : vboxforms
    "View" : VBoxFormView
  }
