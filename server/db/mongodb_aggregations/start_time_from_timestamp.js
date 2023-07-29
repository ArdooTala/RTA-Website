[
  {
    $match: {
      "operations.end_time": {
        $exists: true,
      },
    },
  },
  {
    $set: {
      operations: {
        $map: {
          input: "$operations",
          as: "op",
          in: {
            $cond: {
              if: {
                $not: ["$$op.end_time"],
              },
              then: {
                $mergeObjects: [
                  "$$op",
                  {
                    start_time: {
                      $dateToString: {
                        date: {
                          $dateSubtract: {
                            startDate:
                              "$$op.timestamp",
                            unit: "second",
                            amount: 30,
                          },
                        },
                        format:
                          "%Y-%m-%d %H:%M:%S.%L",
                      },
                    },
                    end_time: {
                      $dateToString: {
                        date: "$$op.timestamp",
                        format:
                          "%Y-%m-%d %H:%M:%S.%L",
                      },
                    },
                    fake_times: true,
                  },
                ],
              },
              else: "$$op",
            },
          },
        },
      },
    },
  },
]