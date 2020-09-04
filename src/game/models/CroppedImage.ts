export class CroppedImage {
  constructor(
    private image: HTMLImageElement,
    private sx: number,
    private sy: number,
    private swidth: number,
    private sheight: number
  ) {}

  draw(
    ctx: CanvasRenderingContext2D,
    dx: number,
    dy: number,
    dwidth: number,
    dheight: number
  ) {
    return ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      this.swidth,
      this.sheight,
      dx,
      dy,
      dwidth,
      dheight
    );
  }
}
