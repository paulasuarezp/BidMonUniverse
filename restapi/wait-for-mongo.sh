#!/bin/sh
# wait-for-mongo.sh

set -e

host="$1"
shift
cmd="$@"

until mongo --host "$host" --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)'; do
  >&2 echo "MongoDB is unavailable - sleeping"
  sleep 1
done

>&2 echo "MongoDB is up - executing command"
exec $cmd
