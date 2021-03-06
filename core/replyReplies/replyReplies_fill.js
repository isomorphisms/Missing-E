/*
 * 'Missing e' Extension
 *
 * Copyright 2011, Jeremy Cutler
 * Released under the GPL version 3 licence.
 * SEE: license/GPL-LICENSE.txt
 *
 * This file is part of 'Missing e'.
 *
 * 'Missing e' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * 'Missing e' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'Missing e'. If not, see <http://www.gnu.org/licenses/>.
 */

(function($){

MissingE.packages.replyRepliesFill = {
   
   reply_getValue: function() {
      var retval = localStorage.getItem("trr_ReplyText");
      if (retval === undefined || retval === null || retval === "") {
         return "";
      }
      else {
         return retval;
      }
   },
   
   reply_clearValue: function() {
      localStorage.removeItem('trr_ReplyText');
   },
   
   tags_getValue: function() {
      var retval = localStorage.getItem("trr_ReplyTags");
      if (retval === undefined || retval === null || retval === "") {
         return [];
      }
      else {
         return retval.split(",");
      }
   },
   
   tags_clearValue: function() {
      localStorage.removeItem('trr_ReplyTags');
   },
   
   reply_setValue: function(st) {
      localStorage.setItem('trr_ReplyText',st);
   },
   
   tags_setValue: function(ar) {
      localStorage.setItem('trr_ReplyTags',ar.join(","));
   },
   
   getAsLinks: function(lang, type) {
      var urlPref = location.href
         .match(/http:\/\/www\.tumblr\.com\/blog\/([^\/]*)/);
      if (urlPref && urlPref.length >= 2) {
         urlPref = '/blog/' + urlPref[1];
      }
      else {
         urlPref = '';
      }
      var othertype = (type==='text' ? 'photo' : 'text');
      return MissingE.getLocale(lang).replyType[type+"Title"] + "\n" +
         '<span class="as_links"><a href="#" id="the_as_link" ' +
         'onclick="Element.hide(this);Element.show(\'the_as_links\');' +
         'return false;" style="font-weight:bold;" >' +
         MissingE.getLocale(lang).replyType.as + '</a>' +
         '<span id="the_as_links" style="display:none;"><a id="as_switch" ' +
         'href="' + urlPref + '/new/' + othertype + '">' +
         MissingE.getLocale(lang).replyType[othertype] + '</a>' +
         '<a href="#" onclick="Element.hide(\'the_as_links\');' +
         'Element.show(\'the_as_link\');return false;">x</a></span></span>';
   },
   
   run: function() {
      if (MissingE.packages.replyRepliesFill.reply_getValue().length > 0) {
         var i, nowtype;
         var reply = MissingE.packages.replyRepliesFill.reply_getValue();
         var tags = MissingE.packages.replyRepliesFill.tags_getValue();
         if (/new\/text/.test(location.href)) {
            nowtype = 'text';
         }
         else {
            nowtype = 'photo';
         }
         $('#left_column h1:first')
            .html(MissingE.packages.replyRepliesFill
                  .getAsLinks($('html').attr('lang'), nowtype));
         $('#as_switch').click(function() {
            MissingE.packages.replyRepliesFill.reply_setValue(reply);
            MissingE.packages.replyRepliesFill.tags_setValue(tags);
         });
         $(document).ready(function() {
            // Sanitization of input text done in replyReplies.js
            // where html is either generated and escaped or used
            // verbatim from existing DOM generated by host site
            $('head').append('<script type="text/javascript">' +
                 'var replyText = localStorage.getItem("trr_ReplyText");' +
                 'if (tinyMCE && (ed = tinyMCE.get("post_two"))) {' +
                     'ed.execCommand("mceInsertContent", false, replyText);' +
                     'ed.onInit.add(function(ed){' +
                        'if (ed.getContent()==""){' +
                           'ed.execCommand("mceInsertContent", ' +
                                           'false, replyText);' +
                        '}' +
                     '});' +
                 '}' +
                 'else {' +
                    'insertTag("post_two", replyText);' +
                 '}' +
                 'localStorage.removeItem("trr_ReplyText");</script>');
         });
         if (tags.length > 0) {
            var txt = "";
            document.getElementById('post_tags').value = tags.join(",");
            for (i=0; i<tags.length; i++) {
               if (tags[i] !== undefined && tags[i] !== null &&
                   tags[i] !== '') {
                  txt += '<div class="token"><span class="tag">' +
                           MissingE.escapeHTML(tags[i]) +
                           '</span><a title="Remove tag" ' +
                           'onclick="tag_editor_remove_tag($(this).up()); ' +
                           'return false;" href="#">x</a></div>';
               }
            }
            if (txt !== '') {
               document.getElementById('tokens').innerHTML = txt;
               var label = document.getElementById('post_tags_label');
               label.parentNode.removeChild(label);
            }
         }
         MissingE.packages.replyRepliesFill.tags_clearValue();
      }
   },

   init: function() {
      if (MissingE.isTumblrURL(location.href, ["post"]) &&
          /\/new\/(text|photo)/.test(location.href) &&
          document.body.id === 'dashboard_edit_post') {
         MissingE.packages.replyRepliesFill.run();
      }
   }
};

if (extension.isChrome ||
    extension.isFirefox) {
   MissingE.packages.replyRepliesFill.init();
}

}(jQuery));
