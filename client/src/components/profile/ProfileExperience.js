import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({ profile: { experience } }) => {
  return (
    <div class='profile-exp bg-white p-2'>
      <h2 class='text-primary'>Experience</h2>
      {experience.length > 0 ? (
        <Fragment>
          {experience.map(exp => (
            <div>
              <h3 class='text-dark'>{exp.company}</h3>
              <p>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment>-{' '}
                {exp.current ? (
                  <span>Now</span>
                ) : (
                  <span>
                    <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
                  </span>
                )}
              </p>
              <p>
                <strong>Position: </strong>
                {exp.title}
              </p>
              <p>
                <strong>Description: </strong>
                {exp.description}
              </p>
            </div>
          ))}
        </Fragment>
      ) : (
        <h4>No Experience Credentials</h4>
      )}
    </div>
  );
};

ProfileExperience.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileExperience;
