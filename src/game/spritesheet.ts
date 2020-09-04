const spritesheet = typeof Image !== 'undefined' ? new Image() : { src: '' };
spritesheet.src = '/invaders.png';

export default spritesheet;
