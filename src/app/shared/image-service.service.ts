import { Injectable } from '@angular/core';

interface ImageStored {
  key: string;
  url: string;
}

@Injectable()
export class ImagesService {
  constructor() {}

  getDirectImageUrl(key: string) {
    const url = images.get(key);
    return url;
  }
}

const images = new Map();
images.set('backgroundLoginImg',
  'https://image.shutterstock.com/image-illustration/3d-illustration-legend-about-king-600w-601673912.jpg');
images.set('wizardArm',
  'https://images.all-free-download.com/images/graphiclarge/luxury_coat_of_arms_design_elements_vector_graphics_527180.jpg');
images.set('knightArm',
  'https://images.all-free-download.com/images/graphiclarge/luxury_coat_of_arms_design_elements_vector_graphics_527179.jpg');
images.set('archerArm',
  'https://images.all-free-download.com/images/graphiclarge/luxury_coat_of_arms_design_elements_vector_graphics_527181.jpg');
images.set('castle-interior',
  // tslint:disable-next-line: max-line-length
  'https://image.shutterstock.com/image-illustration/gorgeous-view-gothic-cathedral-interior-600w-441380302.jpg');
images.set('redBanner',
  'https://www.kindpng.com/picc/m/19-198332_red-banner-transparent-png-clip-art-imageu200b-gallery.png');
images.set('emptyHelmet',
  'https://cdn2.iconfinder.com/data/icons/rpg-fantasy-game-basic-ui/512/head_helmet_armor_warrior_knight_helm-512.png');
images.set('worldMap',
  // tslint:disable-next-line: max-line-length
  'https://preview.redd.it/kgofhmkt40211.jpg?width=960&crop=smart&auto=webp&s=cb52a87611408810e36662ef4f71e97896953b86');
