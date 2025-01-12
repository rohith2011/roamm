import React from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';

const InfoOverlay = ({ show, target, content, onHide }) => {
  return (
    <Overlay
      show={show}
      target={target}
      placement="right"
      onHide={onHide}
      rootClose
    >
      {(props) => (
        <Tooltip id="overlay-tooltip" {...props}>
          {content}
        </Tooltip>
      )}
    </Overlay>
  );
};

export default InfoOverlay;