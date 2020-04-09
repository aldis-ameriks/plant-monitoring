import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class NewDeviceCard extends StatelessWidget {
  NewDeviceCard({@required this.device});

  final dynamic device;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        child: Container(
            padding: EdgeInsets.all(10),
            child: Row(
              children: <Widget>[
                Container(
                  margin: EdgeInsets.only(right: 20),
                  child: Image(
                    image: AssetImage(device['image']),
                    width: 40,
                    height: 60,
                  ),
                ),
                Flexible(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(device['name'],
                            style: Theme.of(context).textTheme.body2),
                      ]),
                )
              ],
            )),
      ),
    );
  }
}
