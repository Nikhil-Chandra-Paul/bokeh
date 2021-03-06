import {Annotation, AnnotationView} from "./annotation"
import {ColumnarDataSource} from "../sources/columnar_data_source"
import {ColumnDataSource} from "../sources/column_data_source"
import {Arrayable} from "core/types"
import {Dimension, SpatialUnits} from "core/enums"
import * as p from "core/properties"

export abstract class UpperLowerView extends AnnotationView {
  model: UpperLower
  visuals: UpperLower.Visuals

  protected _lower: Arrayable<number>
  protected _upper: Arrayable<number>
  protected _base:  Arrayable<number>

  protected _lower_sx: Arrayable<number>
  protected _lower_sy: Arrayable<number>
  protected _upper_sx: Arrayable<number>
  protected _upper_sy: Arrayable<number>

  initialize(): void {
    super.initialize()
    this.set_data(this.model.source)
  }

  set_data(source: ColumnarDataSource): void {
    super.set_data(source)
    this.plot_view.request_render()
  }

  protected _map_data(): void {
    const {frame} = this.plot_view
    const dim = this.model.dimension

    const xscale = this.coordinates.x_scale
    const yscale = this.coordinates.y_scale

    const limit_scale = dim == "height" ? yscale : xscale
    const base_scale  = dim == "height" ? xscale : yscale

    const limit_view = dim == "height" ? frame.yview : frame.xview
    const base_view  = dim == "height" ? frame.xview : frame.yview

    let _lower_sx
    if (this.model.properties.lower.units == "data")
      _lower_sx = limit_scale.v_compute(this._lower)
    else
      _lower_sx = limit_view.v_compute(this._lower)

    let _upper_sx
    if (this.model.properties.upper.units == "data")
      _upper_sx = limit_scale.v_compute(this._upper)
    else
      _upper_sx = limit_view.v_compute(this._upper)

    let _base_sx
    if (this.model.properties.base.units == "data")
      _base_sx  = base_scale.v_compute(this._base)
    else
      _base_sx  = base_view.v_compute(this._base)

    const [i, j] = dim == 'height' ? [1, 0] : [0, 1]

    const _lower = [_lower_sx, _base_sx]
    const _upper = [_upper_sx, _base_sx]

    this._lower_sx = _lower[i]
    this._lower_sy = _lower[j]

    this._upper_sx = _upper[i]
    this._upper_sy = _upper[j]
  }
}

export class XOrYCoordinateSpec extends p.CoordinateSpec {
  readonly obj: UpperLower

  spec: p.Spec & {units: SpatialUnits}

  get dimension(): "x" | "y" {
    return this.obj.dimension == "width" ? "x" : "y"
  }

  // XXX: a hack to make a coordinate & unit spec
  get units(): SpatialUnits {
    return this.spec.units ?? "data"
  }
}

export namespace UpperLower {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Annotation.Props & {
    dimension: p.Property<Dimension>
    lower: XOrYCoordinateSpec
    upper: XOrYCoordinateSpec
    base: XOrYCoordinateSpec
    source: p.Property<ColumnarDataSource>
  }

  export type Visuals = Annotation.Visuals
}

export interface UpperLower extends UpperLower.Attrs {}

export class UpperLower extends Annotation {
  properties: UpperLower.Props

  constructor(attrs?: Partial<UpperLower.Attrs>) {
    super(attrs)
  }

  static init_UpperLower(): void {
    this.define<UpperLower.Props>(({Ref}) => ({
      dimension: [ Dimension, "height" ],
      lower:     [ XOrYCoordinateSpec, {field: "lower"} ],
      upper:     [ XOrYCoordinateSpec, {field: "upper"} ],
      base:      [ XOrYCoordinateSpec, {field: "base"} ],
      source:    [ Ref(ColumnarDataSource), () => new ColumnDataSource() ],
    }))
  }
}
