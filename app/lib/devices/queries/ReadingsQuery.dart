import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ReadingsQuery extends StatelessWidget {
  const ReadingsQuery({@required this.deviceId, @required this.builder});

  final String deviceId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
          query Readings($deviceId: ID!, $date: String) {
            device(deviceId: $deviceId) {
              id
              room
              name
              __typename
            }
            lastReading(deviceId: $deviceId) {
              device_id
              time
              moisture
              temperature
              light
              battery_voltage
            }
            lastWateredTime(deviceId: $deviceId)
            readings(deviceId: $deviceId, date: $date) {
              device_id
              time
              moisture
              temperature
              light
              battery_voltage
            }
          }
      ''', variables: {'deviceId': deviceId}),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            // TODO: Show snackbar upon error
            return Center(child: Text(result.errors.toString()));
          }

          if (result.loading) {
            return Center(
              child: const RefreshProgressIndicator(),
            );
          }

          return builder(result.data, refetch);
        },
      );
}
