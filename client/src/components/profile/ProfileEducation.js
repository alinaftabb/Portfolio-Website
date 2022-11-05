import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({ profile: { education } }) => {
  return (
    <div class='profile-edu bg-white p-2'>
      <h2 class='text-primary'>Education</h2>
      {education.length > 0 ? (
        <Fragment>
          {education.map(edu => (
            <div>
              <h3 class='text-dark'>{edu.school}</h3>
              <p>
                <Moment format='YYYY/MM/DD'>{edu.from}</Moment>-{' '}
                {edu.current ? (
                  <span>Now</span>
                ) : (
                  <span>
                    <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
                  </span>
                )}
              </p>
              <p>
                <strong>Degree: </strong>
                {edu.degree}
              </p>
              <p>
                <strong>Field Of Study: </strong>
                {edu.fieldofstudy}
              </p>
              <p>
                <strong>Description: </strong>
                {edu.description}
              </p>
            </div>
          ))}
        </Fragment>
      ) : (
        <h4>No Education Credentials</h4>
      )}
    </div>
  );
};

ProfileEducation.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileEducation;
