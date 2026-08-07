import type { Schema, Struct } from '@strapi/strapi';

export interface AudienciaSlides extends Struct.ComponentSchema {
  collectionName: 'components_audiencia_slides';
  info: {
    description: 'Slide de la secci\u00F3n de audiencia del Home';
    displayName: 'Slide de Audiencia';
    icon: 'users';
  };
  attributes: {
    descripcion: Schema.Attribute.Text;
    imagen: Schema.Attribute.Media<'images'>;
    numero: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'audiencia.slides': AudienciaSlides;
    }
  }
}
