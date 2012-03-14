from __future__ import absolute_import
import time


def to_epoch(datetime):
    return int(time.mktime(datetime.timetuple()) * 1000)
