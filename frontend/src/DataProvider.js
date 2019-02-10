import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { differenceInMinutes, differenceInDays, subDays } from 'date-fns';

const query = gql`
  query($nodeid: Int, $date: DateTime) {
    readings(nodeid: $nodeid, date: $date) {
      readings {
        time
        humidity
        temperature
      }
      watered
    }
  }
`;

const DataProvider = ({ date, nodeid, render }) => (
  <Query pollInterval={30000} variables={{ date, nodeid }} query={query}>
    {({ loading, error, data }) => {
      if (loading) {
        return null;
      }

      if (error) {
        return <p>Error loading sensor data.</p>;
      }

      const {
        readings: { readings, watered },
      } = data;
      if (!readings || readings.length < 1) {
        return <p>No readings for a long time. Check your sensors.</p>;
      }

      const moistures = readings.map(reading => reading.moisture);
      const temperatures = readings.map(reading => reading.temperature);
      const labels = readings.map(reading => reading.time);
      const currentReading = readings[readings.length - 1];
      const lastWatered = watered ? differenceInDays(new Date(), new Date(watered)) : null;
      const minutesSinceLastReading = differenceInMinutes(new Date(), currentReading.time);

      return render({
        moistures,
        temperatures,
        labels,
        currentReading,
        minutesSinceLastReading,
        lastWatered,
      });
    }}
  </Query>
);

DataProvider.propTypes = {
  render: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  nodeid: PropTypes.number,
};

DataProvider.defaultProps = {
  nodeid: 3,
  date: subDays(new Date(), 90),
};

export default DataProvider;
