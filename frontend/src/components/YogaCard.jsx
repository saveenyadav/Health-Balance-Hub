import React from 'react';
import PropTypes from 'prop-types';

const YogaCard = ({ session, onBook }) => (
  <div className="yoga-card">
    <img src={session.image} alt={session.title} />
    <h3>{session.title}</h3>
    <p>{session.description}</p>
    <button onClick={() => onBook(session)}>Book Now</button>
  </div>
);

YogaCard.propTypes = {
  session: PropTypes.object.isRequired,
  onBook: PropTypes.func.isRequired,
};

export default YogaCard;