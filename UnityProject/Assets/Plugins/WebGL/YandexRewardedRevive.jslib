mergeInto(LibraryManager.library, {
  ArenaShowRewardedRevive: function (gameObjectNamePtr) {
    var go = UTF8ToString(gameObjectNamePtr);
    var send = function (method) {
      try { SendMessage(go, method); } catch (e) { console.error(e); }
    };

    if (!window.ysdk || !window.ysdk.adv || !window.ysdk.adv.showRewardedVideo) {
      console.warn('Yandex Games SDK rewarded video is not ready');
      send('RewardedReviveError');
      return;
    }

    var rewarded = false;
    try {
      window.ysdk.adv.showRewardedVideo({
        callbacks: {
          onOpen: function () {
            try { if (window.unityInstance) window.unityInstance.SendMessage(go, 'OnYandexAdOpen'); } catch (e) {}
          },
          onRewarded: function () {
            rewarded = true;
            send('RewardedReviveGranted');
          },
          onClose: function () {
            if (!rewarded) send('RewardedReviveClosedWithoutReward');
          },
          onError: function (err) {
            console.error('Rewarded revive error', err);
            send('RewardedReviveError');
          }
        }
      });
    } catch (e) {
      console.error('Rewarded revive exception', e);
      send('RewardedReviveError');
    }
  }
});
