define [
  "backbone",
  "common/build_views"
  "common/continuum_view"
  "common/has_parent"
  "common/logging"
  "./textinputtemplate"
], (Backbone, build_views, ContinuumView, HasParent, Logging, template) ->

  logger = Logging.logger

  class TextInputView extends ContinuumView
    tagName : "div"
    attributes :
       class : "bk-widget-form-group"
    template : template
    events :
      "change input" : "change_input"

    change_input : () ->
      value = @$('input').val()
      logger.debug("textinput: value = #{value}")
      @mset('value', value)
      @model.save()

    initialize : (options) ->
      super(options)
      @render()
      @listenTo(@model, 'change', @render)

    render : () ->
      @$el.html(@template(@model.attributes))
      return @

  class TextInput extends HasParent
    type : "TextInput"
    default_view : TextInputView

    defaults: ->
      _.extend {}, super(), {
        name: ""
        value: ""
        title: ""
      }

  class TextInputs extends Backbone.Collection
    model : TextInput

  return {
    Model : TextInput
    Collection : new TextInputs()
  }
