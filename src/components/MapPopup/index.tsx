import React, { useState } from 'react';
import { useEffect } from 'react';
import './index.css';
import { ArcadeInfo, StoreInfoRequest, UpdateStoreRequest } from '../../utils/store';
import { Divider } from '../Divider';
import request from '../../utils/request';
import { GAME_TYPE_LIST } from '../../utils/enums';
import { CancelSVG, OKSVG } from '../../resources/svgs';
import TimePicker from '../TimePicker';
import { formatTime } from '../../utils/utils';
import { c_uid } from '../../utils/cookies';
import { registerAlert } from '../../utils/userUtils';

interface P {
  storeInfo: StoreInfoRequest;
  onStoreUpdate?: () => void;
}

interface ArcadeEditInfo extends ArcadeInfo {
  isEditing?: boolean;
  tempAmount?: number;
  tempVersionType?: string;
}

export default (props: P) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const [editingStartHour, setEditingStartHour] = useState(-1);
  const [editingStartMinute, setEditingStartMinute] = useState(-1);
  const [editingEndHour, setEditingEndHour] = useState(-1);
  const [editingEndMinute, setEditingEndMinute] = useState(-1);
  const [editingDesc, setEditingDesc] = useState('');

  const [editingArcades, setEditingArcades] = useState<ArcadeEditInfo[]>([]);
  const [isAddingArcade, setIsAddingArcade] = useState(false);
  const [newArcadeType, setNewArcadeType] = useState('');
  const [newArcadeAmount, setNewArcadeAmount] = useState('');
  const [newArcadeVersion, setNewArcadeVersion] = useState('ja');

  useEffect(() => {
    request('/arcade.php?sid=' + props.storeInfo.id, { method: 'GET' })
      .then(e => {
        setEditingArcades(
          e.arcades.map((arcade: ArcadeInfo) => ({
            ...arcade,
            isEditing: false,
          }))
        );
      })
      .catch(e => {
        console.log(e);
      });
  }, [props.storeInfo.id]);

  const handleTimeEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!registerAlert()) {
      return;
    }
    setEditingStartHour(props.storeInfo.business_hours_start ?? -1);
    setEditingStartMinute(props.storeInfo.business_minute_start ?? 0);
    setEditingEndHour(props.storeInfo.business_hours_end ?? -1);
    setEditingEndMinute(props.storeInfo.business_minute_end ?? 0);
    setIsEditingTime(true);
  };

  const handleTimeEditConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startH = editingStartHour;
    const startM = editingStartMinute;
    const endH = editingEndHour;
    const endM = editingEndMinute;

    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
      alert('無効時間形式');
      return;
    }

    const updateData: UpdateStoreRequest = {
      id: props.storeInfo.id,
      business_hours_start: startH,
      business_minute_start: startM,
      business_hours_end: endH,
      business_minute_end: endM,
    };

    request('/store.php', {
      method: 'PATCH',
      data: updateData,
    }).then(() => {
      setIsEditingTime(false);
      props.onStoreUpdate?.();
    });
  };

  const handleAmountEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!registerAlert()) {
      return;
    }
    setIsEditingAmount(!isEditingAmount);
    setIsAddingArcade(false);
    setEditingArcades(editingArcades.map(a => ({ ...a, isEditing: false })));
  };

  const handleDescEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!registerAlert()) {
      return;
    }
    setEditingDesc(props.storeInfo.desc || '');
    setIsEditingDesc(true);
  };

  const handleDescEditConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updateData: UpdateStoreRequest = {
      id: props.storeInfo.id,
      desc: editingDesc,
    };

    request('/store.php', {
      method: 'PATCH',
      data: updateData,
    }).then(() => {
      setIsEditingDesc(false);
      props.onStoreUpdate?.();
    });
  };

  const handleCancel = (e: React.MouseEvent, setter: (value: boolean) => void) => {
    e.stopPropagation();
    setter(false);
  };

  const handleArcadeAmountEdit = (arcade: ArcadeEditInfo, amount: string) => {
    setEditingArcades(editingArcades.map(a => (a.id === arcade.id ? { ...a, tempAmount: parseInt(amount) || 0 } : a)));
  };

  const handleArcadeVersionEdit = (arcade: ArcadeEditInfo, version: string) => {
    setEditingArcades(editingArcades.map(a => (a.id === arcade.id ? { ...a, tempVersionType: version } : a)));
  };

  const handleArcadeEditConfirm = (arcade: ArcadeEditInfo) => {
    if (arcade.tempAmount === undefined && arcade.tempVersionType === undefined) return;

    request('/arcade.php', {
      method: 'PATCH',
      data: {
        id: arcade.id,
        ...(arcade.tempAmount !== undefined && { arcade_amount: arcade.tempAmount }),
        ...(arcade.tempVersionType !== undefined && { version_type: arcade.tempVersionType }),
      },
    }).then(() => {
      setEditingArcades(
        editingArcades.map(a =>
          a.id === arcade.id
            ? {
                ...a,
                isEditing: false,
                arcade_amount: arcade.tempAmount ?? a.arcade_amount,
                version_type: arcade.tempVersionType ?? a.version_type,
                tempAmount: undefined,
                tempVersionType: undefined,
              }
            : a
        )
      );
      props.onStoreUpdate?.();
    });
  };

  const handleArcadeEditStart = (arcade: ArcadeEditInfo) => {
    if (!registerAlert()) {
      return;
    }
    setEditingArcades(
      editingArcades.map(a =>
        a.id === arcade.id
          ? {
              ...a,
              isEditing: true,
              tempAmount: arcade.arcade_amount,
              tempVersionType: arcade.version_type,
            }
          : a
      )
    );
  };

  const handleArcadeEditCancel = (arcade: ArcadeEditInfo) => {
    setEditingArcades(
      editingArcades.map(a =>
        a.id === arcade.id
          ? {
              ...a,
              isEditing: false,
              tempAmount: undefined,
              tempVersionType: undefined,
            }
          : a
      )
    );
  };

  const handleAddArcade = () => {
    if (!registerAlert()) {
      return;
    }
    if (!newArcadeType || !newArcadeAmount) {
      alert('種類数量入力！');
      return;
    }

    request('/arcade.php', {
      method: 'POST',
      data: {
        sid: props.storeInfo.id,
        type: newArcadeType,
        arcade_amount: parseInt(newArcadeAmount),
        version_type: newArcadeVersion,
      },
    }).then(() => {
      setIsAddingArcade(false);
      setNewArcadeType('');
      setNewArcadeAmount('');
      setNewArcadeVersion('ja');
      props.onStoreUpdate?.();
    });
  };

  const handleCollection = () => {
    if (!registerAlert()) {
      return;
    }
    if (props.storeInfo.is_collection) {
      request('/collection.php', {
        method: 'DELETE',
        data: {
          store_id: props.storeInfo.id,
          uid: c_uid(),
        },
      }).then(() => {
        props.onStoreUpdate?.();
      });
    } else {
      request('/collection.php', {
        method: 'POST',
        data: {
          store_id: props.storeInfo.id,
          uid: c_uid(),
        },
      }).then(() => {
        props.onStoreUpdate?.();
      });
    }
  };

  return (
    <div className="popupContents" onClick={e => e.stopPropagation()}>
      <p id="storepopup_title">{props.storeInfo.name}</p>
      <p style={{ padding: '10px 0' }}>{props.storeInfo.address}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href={props.storeInfo.mapURL} target="_blank">
          <p>
            開 Google Map&nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
              />
              <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
            </svg>
          </p>
        </a>
        <button className="flex collectionButton" onClick={handleCollection}>
          <span style={{ color: props.storeInfo.is_collection ? '#fbb160' : 'gray' /*''*/ }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
          </span>
          <span>{props.storeInfo.is_collection ? '収蔵移出' : '収蔵'}</span>
        </button>
      </div>
      <Divider style={{ margin: '10px 0' }} />
      <div className="businessTime popupItem">
        {isEditingTime ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p>営業時間：</p>
              <div className="editingButtons">
                <button className="confirmButton" onClick={handleTimeEditConfirm}>
                  <OKSVG />
                </button>
                <button className="cancelButton" onClick={e => handleCancel(e, setIsEditingTime)}>
                  <CancelSVG />
                </button>
              </div>
            </div>
            <div onClick={e => e.stopPropagation()}>
              <TimePicker
                hourValue={editingStartHour}
                minuteValue={editingStartMinute}
                maxHour={24}
                onChange={(h, m) => {
                  setEditingStartHour(h);
                  setEditingStartMinute(m);
                }}
              />
              ~
              <TimePicker
                hourValue={editingEndHour}
                minuteValue={editingEndMinute}
                maxHour={30}
                onChange={(h, m) => {
                  setEditingEndHour(h);
                  setEditingEndMinute(m);
                }}
              />
            </div>
          </div>
        ) : (
          <>
            {props.storeInfo.business_hours_start === -1 && props.storeInfo.business_hours_end === -1 ? (
              <p>営業時間未知</p>
            ) : (
              <p>
                営業時間：
                <time>{formatTime(props.storeInfo.business_hours_start ?? 0, props.storeInfo.business_minute_start ?? 0)}</time>~
                <time>{formatTime(props.storeInfo.business_hours_end ?? 0, props.storeInfo.business_minute_end ?? 0)}</time>
              </p>
            )}
            <button className="editButton" onClick={handleTimeEditStart}>
              編集
            </button>
          </>
        )}
      </div>
      <div className="arcadeAmount popupItem">
        <p>現有筐体：</p>
        <button className="editButton" onClick={handleAmountEditStart}>
          {isEditingAmount ? '編集取消' : '編集'}
        </button>
      </div>
      <div className="popupItem">
        <div className="arcadeTable">
          {editingArcades.map((arcade: ArcadeEditInfo) => (
            <div key={arcade.id} className="arcadeTableRow">
              <div className="arcadeTableColumn type">{arcade.type === 'maimai' ? 'maimai旧筐体' : arcade.type}</div>
              {arcade.isEditing ? (
                <>
                  <select
                    className="editingInput"
                    value={arcade.tempVersionType ?? arcade.version_type}
                    onChange={e => handleArcadeVersionEdit(arcade, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    style={{ width: '80px' }}
                  >
                    <option value="ja">日本版</option>
                    <option value="inter">国际版</option>
                    <option value="cn">中国版</option>
                  </select>
                  <input
                    className="editingInput"
                    type="number"
                    value={arcade.tempAmount ?? arcade.arcade_amount}
                    onChange={e => handleArcadeAmountEdit(arcade, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    style={{ width: '70px' }}
                  />
                  <div className="editingButtons">
                    <button className="confirmButton" onClick={() => handleArcadeEditConfirm(arcade)}>
                      <OKSVG />
                    </button>
                    <button className="cancelButton" onClick={() => handleArcadeEditCancel(arcade)}>
                      <CancelSVG />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="arcadeTableColumn version">
                    {arcade.version_type === 'ja' ? '日本版' : arcade.version_type === 'inter' ? '国际版' : arcade.version_type === 'cn' ? '中国版' : '未知'}
                  </div>
                  <div className="arcadeTableColumn amount">{(arcade.arcade_amount ?? 0) <= -1 ? '？' : arcade.arcade_amount}台</div>
                  {isEditingAmount && (
                    <button className="editButton" onClick={() => handleArcadeEditStart(arcade)}>
                      編集
                    </button>
                  )}
                </>
              )}
            </div>
          ))}

          {isEditingAmount &&
            (isAddingArcade ? (
              <div>
                <div className="arcadeTableRow">
                  <select
                    className="editingInput"
                    value={newArcadeType}
                    onChange={e => {
                      if (e.target.value === 'empty') {
                        alert('筐体種類1種選択');
                      } else {
                        setNewArcadeType(e.target.value);
                      }
                    }}
                    onClick={e => e.stopPropagation()}
                    style={{ width: '100px' }}
                  >
                    <option value={'empty'}>筐体種類</option>
                    {GAME_TYPE_LIST.map(game_type => {
                      if (editingArcades.find(a => a.type === game_type)) return null;
                      return (
                        <option key={game_type} value={game_type}>
                          {game_type === 'maimai' ? 'maimai旧筐体' : game_type}
                        </option>
                      );
                    })}
                  </select>
                  <select className="editingInput" value={newArcadeVersion} onChange={e => setNewArcadeVersion(e.target.value)} onClick={e => e.stopPropagation()} style={{ width: '80px' }}>
                    <option value="ja">日本版</option>
                    <option value="inter">国际版</option>
                    <option value="cn">中国版</option>
                  </select>
                  <input
                    className="editingInput"
                    type="number"
                    value={newArcadeAmount}
                    onChange={e => setNewArcadeAmount(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    placeholder="数量"
                    style={{ width: '60px' }}
                  />
                </div>
                <div className="editingButtons">
                  <button className="confirmButton" onClick={handleAddArcade}>
                    追加
                  </button>
                  <button
                    className="cancelButton"
                    onClick={() => {
                      setIsAddingArcade(false);
                      setNewArcadeType('');
                      setNewArcadeAmount('');
                      setNewArcadeVersion('ja');
                    }}
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="addArcadeButton"
                onClick={() => {
                  if (!registerAlert()) {
                    return;
                  }
                  setIsAddingArcade(true);
                }}
              >
                + 新種筐体追加
              </button>
            ))}
        </div>
      </div>
      <div>
        <div className="popupItem">
          <p>備考</p>
          {isEditingDesc ? (
            <div className="editingButtons">
              <button className="confirmButton" onClick={handleDescEditConfirm}>
                確定
              </button>
              <button className="cancelButton" onClick={e => handleCancel(e, setIsEditingDesc)}>
                取消
              </button>
            </div>
          ) : (
            <button className="editButton" onClick={handleDescEditStart}>
              編集
            </button>
          )}
        </div>
        {isEditingDesc ? (
          <textarea className="editingInput" value={editingDesc} onChange={e => setEditingDesc(e.target.value)} onClick={e => e.stopPropagation()} style={{ width: '100%', minHeight: '60px' }} />
        ) : (
          <p style={{ margin: '0' }}>{props.storeInfo.desc}</p>
        )}
      </div>
    </div>
  );
};
