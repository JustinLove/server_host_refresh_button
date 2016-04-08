(function() {
  "use strict"

  if (scene_mod_list['new_game']
   && scene_mod_list['new_game'].indexOf("coui://ui/mods/icon_extensions/new_game.js") != -1) {
    return
  }

  var new_game_server_mod_info_updated = handlers.server_mod_info_updated
  handlers.server_mod_info_updated = function() {
    new_game_server_mod_info_updated()

    console.log('server_mod_info_updated')
    if (model.isGameCreator()) showButtonWhenAppropriate()
  }

  var showButtonWhenAppropriate = function() {
    api.mods.getMountedMods("server", function (mod_array) {
      if (mod_array.length > 0
       && (_.findIndex( mod_array, { identifier : 'com.pa.pamm.server' } ) != -1
        || _.findIndex( mod_array, { identifier : 'community-mods-server' } ) != -1)
         ) {
        $.get('coui://ui/mods/ui_mod_list.js').then(function(text) {
          // global_server_mod_list = [] when no global server mods
          if (text.match(/new_game|global_server_mod_list = \[\n/)) {
            model.displayRefreshUI('inline-block')
          }
        })
      }
    });
  }

  model.displayRefreshUI = ko.observable('none')

  model.refreshUI = function() {
    api.game.debug.reloadScene(api.Panel.pageId);
  }

  var button = '<div class="btn_hero" id="refresh_ui" data-bind="click: refreshUI, style: { display: model.displayRefreshUI()}, click_sound: \'default\', rollover_sound: \'default\'" style="margin: 0px -5px;">' +
      '<div class="btn_label" style="width: 120px;">' +
          'Reload UI' +
      '</div>' +
  '</div> '

  $('#join').before(button)
})()
