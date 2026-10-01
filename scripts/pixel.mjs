import sharp from 'sharp'
for (const f of ['desktop-light','desktop-dark','mobile-light','mobile-dark']) {
  const img = sharp(`screenshots/${f}.png`)
  const meta = await img.metadata()
  const { data } = await img.raw().toBuffer({ resolveWithObject: true })
  const px = (x,y) => { const i=(y*meta.width+x)*meta.channels; return `${data[i]},${data[i+1]},${data[i+2]}` }
  console.log(`${f} ${meta.width}x${meta.height} topleft=${px(4,4)} mid=${px(Math.floor(meta.width/2), Math.floor(meta.height/2))}`)
}
