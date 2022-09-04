import React, { Fragment, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCurrentProfile } from '../../actions/profile';
import DashboardActions from './DashboardActions';

const Dashboard = ({ getCurrentProfile, auth: { user }, profile }) => {
  const [pro, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setProfile(profile?.profile);
      setLoading(profile?.loading);
    }
  }, [profile]);

  return loading && pro === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
      {pro !== null ? (
        <Fragment>
          <DashboardActions />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProp = state => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProp, { getCurrentProfile })(Dashboard);
