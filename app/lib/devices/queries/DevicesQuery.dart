import 'package:aa.iot/delayed_loader.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class DevicesQuery extends StatelessWidget {
  const DevicesQuery({@required this.builder});

  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
          query Devices {
            devices {
              id
              room
              name
              firmware
              __typename
            }
          }
      ''', fetchPolicy: FetchPolicy.noCache),
        builder: (result, {refetch, fetchMore}) {
          if (result.hasException) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: Center(
                    child: Text(result.exception.toString(), textAlign: TextAlign.center),
                  ),
                ),
                RaisedButton(
                  padding: EdgeInsets.all(12),
                  onPressed: () {
                    refetch();
                  },
                  color: Theme.of(context).accentColor,
                  child: Text("Press to retry", style: TextStyle(color: Colors.white)),
                )
              ],
            );
          }

          if (result.loading) {
            return Center(
              child: DelayedLoader(),
            );
          }
          return builder(result.data, refetch);
        },
      );
}
