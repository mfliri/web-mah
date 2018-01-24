import React from 'react';
/* eslint react/jsx-filename-extension: 0 */

export default props => (
  props.results === 1 ?
    (<p>Tienes {props.results} mensaje sin leer. De {props.totalMsg} en total.</p>)
    :
    (<p>Tienes {props.results} mensajes sin leer. De {props.totalMsg} en total.</p>)
);
