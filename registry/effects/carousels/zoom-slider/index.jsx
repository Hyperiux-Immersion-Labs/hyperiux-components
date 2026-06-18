import React from 'react';
import ZoomSliderComp from './ZoomSliderComp';

const ZoomSlider = () => {
  return (
    <ZoomSliderComp
      title="Zoom Slider"
      subheading="Scroll to explore "
      sliderData={DEFAULT_SLIDER_DATA}
    />
  );
};
 

export default ZoomSlider;

const DEFAULT_SLIDER_DATA = [
  {
    number: '01',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-09.jpg',
    title: 'AURA',
    desc: 'Soft light and atmospheric tones',
  },
  {
    number: '02',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-07.jpg',
    title: 'DRIFT',
    desc: 'Floating through silence',
  },
  {
    number: '03',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-03.jpg',
    title: 'FORM',
    desc: 'Shapes carved by light',
  },
  {
    number: '04',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-08.jpg',
    title: 'FLOW',
    desc: 'Smooth transitions in motion',
  },
  {
    number: '05',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg',
    title: 'DEPTH',
    desc: 'Layers and visual weight',
  },
  {
    number: '06',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-06.jpg',
    title: 'ENERGY',
    desc: 'Movement captured in time',
  },
  {
    number: '07',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-02.jpg',
    title: 'GLITCH',
    desc: 'Breaking visual boundaries',
  },
  {
    number: '08',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-08.jpg',
    title: 'FRAME-X',
    desc: 'Cinematic still frame',
  },
  {
    number: '09',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-01.jpg',
    title: 'LIGHTPLAY',
    desc: 'Contrast and highlights',
  },
  {
    number: '10',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg',
    title: 'MINIMAL',
    desc: 'Less but stronger',
  },
];
