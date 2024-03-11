import { Img, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import { all, chain, createSignal, linear, loopUntil, makeRef, map, sin, tween, waitFor } from '@motion-canvas/core';

import { leden } from '../namen';

import logo from "../logo.png";
import logo_inv from "../logo-inv.png";

type Pos = {
  left: boolean,
  top: boolean
}

const HALF_SCREEN_W = 720 / 2;
const HALF_SCREEN_H = 576 / 2;
const MARGIN = 80;

const posities: Pos[] = [
  { left: true, top: true },
  { left: false, top: false },
  { left: true, top: false },
  { left: false, top: true },
]

export default makeScene2D(function* (view) {
  let inv = true;
  
  let bgRect: Rect = <Rect width={HALF_SCREEN_W * 2} height={HALF_SCREEN_H * 2} fill="#850101" /> as Rect;

  view.add(bgRect)

  let img: Img = <Img src={logo} width={HALF_SCREEN_W * 1.8} position={[0, 0]} /> as Img;
  view.add(img);

  let titleText: Txt = <Txt fontFamily="Iosevka" fill="#ffffff" position={[0, 200]}>ludieke kandidatuurstelling</Txt> as Txt;
  view.add(titleText);

  yield* waitFor(3)

  yield* all(img.position.x(-HALF_SCREEN_W/2, 1), img.scale([1 / 1.8, 1 / 1.8], 1), titleText.opacity(0, 0.8))

  let groepen: Rect[] = [];

  leden.map((lid, index) => {
    let layout: Rect;
    const pos = posities[index % 4];

    if (posities[index % 4].left) {
      layout = <Rect ref={makeRef(groepen, index)} layout direction={'column'} alignItems={"start"} opacity={0} /> as Rect;
    } else {
      layout = <Rect ref={makeRef(groepen, index)} layout direction={'column'} alignItems={"end"} opacity={0} /> as Rect;
    }
    const naam = <Txt fontFamily="Iosevka" fill={"#ffffff"} fontSize={42} fontWeight={900} lineWidth={4} shadowColor="#ffffff" shadowBlur={4} strokeFirst>{lid.naam}</Txt>
    layout.add(naam);
    if (lid.functie) {
      const functie = <Txt fontFamily="Iosevka" fill={"#ffffff"} fontSize={32} lineWidth={4} shadowColor="#ffffff" shadowBlur={4} strokeFirst>{lid.functie!}</Txt>
      layout.add(functie);
    }

    layout.position(() => {
      let x = pos.left ? -HALF_SCREEN_W + layout.width() / 2 + MARGIN : HALF_SCREEN_W - layout.width() / 2 - MARGIN;
      let y = pos.top ? -HALF_SCREEN_H + layout.height() / 2 + MARGIN : HALF_SCREEN_H - layout.height() / 2 - MARGIN;
      return [x, y]
    })

    view.add(layout);
  })

  let generators = [];

  for (const groep of groepen) {
    generators.push(
      chain(
        groep.opacity(1, 0.2),
        groep.position.x(0, 4, linear),
        groep.opacity(0, 0.2),
      )
    )
  }

  yield* all(
    loopUntil("stopX", () => img.position.x(HALF_SCREEN_W / 2, 10, linear).to(-HALF_SCREEN_W / 2, 10, linear)),
    loopUntil("stopY", () => img.position.y(HALF_SCREEN_H - Math.abs(img.top().y - img.bottom().y) / 2, 11, linear).to(-HALF_SCREEN_H +  Math.abs(img.top().y - img.bottom().y) / 2, 11, linear)),
    loopUntil('stopInvX', () => chain(
      () => {
        if (inv) {
          bgRect.fill("#ffffff");
          img.src(logo_inv);
          for (let groep of groepen) { groep.childrenAs<Txt>().forEach((tekst) => { tekst.fill("#850101"); tekst.stroke("#ffffff") }) }
          inv = false;
        } else {
          bgRect.fill("#850101");
          img.src(logo);
          for (let groep of groepen) { groep.childrenAs<Txt>().forEach((tekst) => { tekst.fill("#ffffff"); tekst.stroke("#850101")}) }
          inv = true;
        }
      },
      waitFor(10)
    )),
    loopUntil('stopInvY', () => chain(
      () => {
        if (inv) {
          bgRect.fill("#ffffff");
          img.src(logo_inv);
          for (let groep of groepen) { groep.childrenAs<Txt>().forEach((tekst) => { tekst.fill("#850101"); tekst.stroke("#ffffff") }) }
          inv = false;
        } else {
          bgRect.fill("#850101");
          img.src(logo);
          for (let groep of groepen) { groep.childrenAs<Txt>().forEach((tekst) => { tekst.fill("#ffffff"); tekst.stroke("#850101")}) }
          inv = true;
        }
      },
      waitFor(11)
    )),
    chain(...generators)
  )

});
