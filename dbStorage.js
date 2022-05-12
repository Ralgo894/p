// DBストレージ.
// ブラウザ内データベースを利用した
// ローカルストレージの代わりをする処理.
(function (_global) {
  "use strict";

  // undefined定義.
  var _u = undefined;

  var _c = function (call, value) {
    if (typeof (call) == "function") call(value);
  }

  // indexedDBが利用可能.
  try {
    _global.indexedDB = _global.indexedDB ||
      _global.mozIndexedDB ||
      _global.webkitIndexedDB ||
      _global.OIndexedDB ||
      _global.msIndexedDB;
  } catch (e) {}
  var idxdbs = null;
  if (_global.indexedDB != _u) {
    idxdbs = function () {
      var _name = 'dbLocalStorage'
      var _version = 100; // 1.00.

      var _table = "DbStorageByLocalTable";
      var _keyColumn = "pkey";
      var _valueColumn = "value";

      var _db = null;

      var o = {};

      // 初期処理.
      var _init = function (c) {
        var object = indexedDB.open(_name, _version);
        object.onupgradeneeded = function (ev) {
          console.log("### [indexedDB] upgradeneeded");
          try {
            var db = object.result;
            db.transaction.onerror = function (err) {
              console.log("error indexedDB(init[onupgradeneeded])", err);
            }
            if (db.objectStoreNames.contains(_table)) {
              db.deleteObjectStore(_table);
            }
            db.createObjectStore(_table, {
              keyPath: "" + _keyColumn,
              autoIncrement: false
            });
          } catch (e) {
            console.log("error init[onupgradeneeded]:" + e);
          }
        }
        object.onsuccess = function (ev) {
          console.log("### [indexedDB] success");
          try {
            _db = (ev["target"] != _u && ev["target"] != null) ?
              ev["target"].result : ev.result;
          } catch (e) {
            _db = null;
            console.log("error init[onsuccess]:" + e);
          }
          if (c != _u) c();
        }
      }

      // テーブル内クリア.
      var _clear = function (tx, call) {
        try {
          var store = tx.objectStore(_table);
          store.clear();
          tx.oncomplete = function () {
            _c(call, true);
          }
          tx.onabort = tx.onerror = function () {
            _c(call, false);
          }
        } catch (e) {
          console.log("error clear:" + e);
          _c(call, false);
        }
      }

      // 行削除.
      var _delete = function (tx, key, call) {
        try {
          var store = tx.objectStore(_table);
          store.delete("" + key);
          tx.oncomplete = function () {
            _c(call, true);
          }
          tx.onabort = tx.onerror = function () {
            _c(call, false);
          }
        } catch (e) {
          console.log("erro delete:" + e);
          _c(call, false);
        }
      }

      // 行追加.
      var _insert = function (tx, key, value, call) {
        try {
          var store = tx.objectStore(_table);
          var v = {};
          v[_keyColumn] = "" + key;
          v[_valueColumn] = "" + value;
          store.put(v);
          tx.oncomplete = function () {
            _c(call, true);
          }
          tx.onabort = tx.onerror = function () {
            _c(call, false);
          }
        } catch (e) {
          console.log("error add:" + e);
          _c(call, false);
        }
      }

      // １行取得.
      var _get = function (tx, key, call) {
        try {
          var store = tx.objectStore(_table);
          var req = store.get("" + key);
          req.onsuccess = function () {
            var v = req.result;
            if (v == _u || v == null) {
              v = "";
            } else if (v.value == _u || v.value == null) {
              v.value = "";
            }
            _c(call, v.value);
          }
          req.onerror = function () {
            _c(call, null);
          }
        } catch (e) {
          console.log("error get:" + e);
          _c(call, null);
        }
      }

      // readWrite transaction.
      var _tran = function () {
        try {
          return _db.transaction(_table, "readwrite");
        } catch (e) {
          console.log("error getTransaction(rw):" + e);
        }
      }

      // readOnly transaction.
      var _rTran = function () {
        try {
          return _db.transaction(_table, "readonly");
        } catch (e) {
          console.log("error getTransaction(r):" + e);
        }
      }

      // 初期処理.
      var _initFlag = false;
      var init = function (c) {
        var n = _initFlag;
        _initFlag = true;
        if (!n) {
          _init(c);
        } else {
          if (c != _u) c();
        }
      }

      // 全データクリア.
      o.clear = function (call) {
        init(function () {
          _clear(_tran(), call);
        });
      }

      // データセット.
      o.add = o.put = function (key, value, call) {
        init(function () {
          _insert(_tran(), key, value, call);
        });
      }

      // データ削除.
      o.remove = function (key, call) {
        init(function () {
          _delete(_tran(), key, call);
        });
      }

      // データ取得.
      o.get = function (key, call) {
        init(function () {
          _get(_rTran(), key, call);
        });
      }

      // 区分.
      o.type = function () {
        init();
        return "indexedDB";
      }

      return o;
    }
  }

  // WebSQLが利用可能な場合.
  var wsqls = null;
  if (_global["openDatabase"] != _u) {
    wsqls = function () {
      var _name = 'dbLocalStorage'
      var _version = '1.0'
      var _description = 'dbLocalStorage'
      var _size = 5 * 1048576;

      var _table = "DbStorageByLocalTable";
      var _keyColumn = "id";
      var _valueColumn = "value";

      // データベース取得.
      var _db = openDatabase(_name, _version, _description, _size);

      var o = {};

      // 基本テーブル作成.
      var _create = function (tx, call) {
        tx.executeSql("create table if not exists " + _table +
          " (" + _keyColumn + " TEXT NOT NULL PRIMARY KEY UNIQUE" +
          " ," + _valueColumn + " TEXT)", [],
          function () {
            _c(call, true);
          },
          function () {
            _c(call, false);
          }
        );
      }

      // テーブル破棄.
      var _drop = function (tx, call) {
        tx.executeSql("drop table " + _table, [],
          function () {
            _c(call, true);
          },
          function () {
            _c(call, false);
          }
        );
      }

      // 行削除.
      var _delete = function (tx, key, call) {
        tx.executeSql("DELETE FROM " + _table + " WHERE " + _keyColumn + "=?", ["" + key],
          function () {
            _c(call, true);
          },
          function () {
            _c(call, false);
          }
        );
      }

      // 行追加.
      var _insert = function (tx, key, value, call) {
        tx.executeSql("INSERT INTO " + _table + " VALUES ( ?, ? )", ["" + key, "" + value],
          function () {
            _c(call, true);
          },
          function () {
            _c(call, false);
          }
        );
      }

      // 初期処理.
      var _initFlag = false;
      var init = function (c) {
        var n = _initFlag;
        _initFlag = true;
        if (!n) {
          // 基本テーブル作成.
          _db.transaction(
            function (tx) {
              _create(tx);
              if (c != _u) c();
            }
          );
        } else {
          if (c != _u) c();
        }
      }

      // 全データクリア.
      o.clear = function (call) {
        init(function () {
          _db.transaction(
            function (tx) {
              _drop(tx, function () {
                _create(tx, call);
              });
            });
        });
      }

      // データセット.
      o.add = o.put = function (key, value, call) {
        init(function () {
          _db.transaction(
            function (tx) {
              _delete(tx, key, function () {
                _insert(tx, key, value, call);
              });
            });
        });
      }

      // データ削除.
      o.remove = function (key, call) {
        init(function () {
          _db.transaction(
            function (tx) {
              _delete(tx, key, call);
            });
        });
      }

      // データ取得.
      o.get = function (key, call) {
        init(function () {
          _db.transaction(
            function (tx) {
              tx.executeSql(
                "SELECT " + _valueColumn + " FROM " +
                _table + " WHERE " + _keyColumn + "=? limit 1", [key],
                function (tx, rs) {
                  var len = rs.rows.length;
                  if (len != 1) {
                    _c(call, null);
                  } else {
                    var row = rs.rows.item(0);
                    _c(call, row[_valueColumn]);
                  }
                }
              );
            });
        });
      }
      // 区分.
      o.type = function () {
        init();
        return "webDB";
      }
      return o;
    }
  }

  var dbStorage = null;

  // indexedDBが利用可能な場合は、それで処理対象とする.
  if (idxdbs != null) {
    dbStorage = idxdbs();

    // WebSQLが利用可能な場合は、それで処理対象とする.
  } else if (wsqls != null) {
    dbStorage = wsqls();

    // 対応Webデータベースが存在しない場合は、メモリで代わりを行う.
  } else {
    dbStorage = (function () {
      var o = {};
      var map = {}
      o.clear = function (call) {
        map = {};
        _c(call, true);
      }
      o.add = o.put = function (key, value, call) {
        map["" + key] = value;
        _c(call, true);
      }
      o.remove = function (key, call) {
        delete map["" + key];
        _c(call, true);
      }
      o.get = function (key, call) {
        var ret = map["" + key];
        _c(call, ret);
      }
      o.type = function () {
        return "memory";
      }
      return o;
    })();
  }

  _global.dbStorage = dbStorage;

})(window);
