System.register('flarum/tags/models/Tag', ['flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export) {
  'use strict';

  var Model, mixin, computed, Tag;

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_flarumModel) {
      Model = _flarumModel['default'];
    }, function (_flarumUtilsMixin) {
      mixin = _flarumUtilsMixin['default'];
    }, function (_flarumUtilsComputed) {
      computed = _flarumUtilsComputed['default'];
    }],
    execute: function () {
      Tag = (function (_mixin) {
        _inherits(Tag, _mixin);

        function Tag() {
          _classCallCheck(this, Tag);

          _get(Object.getPrototypeOf(Tag.prototype), 'constructor', this).apply(this, arguments);
        }

        return Tag;
      })(mixin(Model, {
        name: Model.attribute('name'),
        slug: Model.attribute('slug'),
        description: Model.attribute('description'),

        color: Model.attribute('color'),
        backgroundUrl: Model.attribute('backgroundUrl'),
        backgroundMode: Model.attribute('backgroundMode'),

        position: Model.attribute('position'),
        parent: Model.hasOne('parent'),
        defaultSort: Model.attribute('defaultSort'),
        isChild: Model.attribute('isChild'),
        isHidden: Model.attribute('isHidden'),

        discussionsCount: Model.attribute('discussionsCount'),
        lastTime: Model.attribute('lastTime', Model.transformDate),
        lastDiscussion: Model.hasOne('lastDiscussion'),

        isRestricted: Model.attribute('isRestricted'),
        canStartDiscussion: Model.attribute('canStartDiscussion'),

        isPrimary: computed('position', 'parent', function (position, parent) {
          return position !== null && parent === false;
        })
      }));

      _export('default', Tag);
    }
  };
});;System.register('flarum/tags/helpers/tagIcon', [], function (_export) {
  'use strict';

  _export('default', tagIcon);

  function tagIcon(tag) {
    var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    attrs.className = 'icon TagIcon ' + (attrs.className || '');

    if (tag) {
      attrs.style = attrs.style || {};
      attrs.style.backgroundColor = tag.color();
    } else {
      attrs.className += ' untagged';
    }

    return m('span', attrs);
  }

  return {
    setters: [],
    execute: function () {}
  };
});;System.register('flarum/tags/helpers/tagLabel', ['flarum/utils/extract'], function (_export) {
  'use strict';

  var extract;

  _export('default', tagLabel);

  function tagLabel(tag) {
    var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    attrs.style = attrs.style || {};
    attrs.className = 'TagLabel ' + (attrs.className || '');

    var link = extract(attrs, 'link');

    if (tag) {
      var color = tag.color();
      if (color) {
        attrs.style.backgroundColor = attrs.style.color = color;
        attrs.className += ' colored';
      }

      if (link) {
        attrs.title = tag.description() || '';
        attrs.href = app.route('tag', { tags: tag.slug() });
        attrs.config = m.route;
      }
    } else {
      attrs.className += ' untagged';
    }

    return m(link ? 'a' : 'span', attrs, m(
      'span',
      { className: 'TagLabel-text' },
      tag ? tag.name() : app.trans('tags.deleted')
    ));
  }

  return {
    setters: [function (_flarumUtilsExtract) {
      extract = _flarumUtilsExtract['default'];
    }],
    execute: function () {}
  };
});;System.register('flarum/tags/helpers/tagsLabel', ['flarum/utils/extract', 'flarum/tags/helpers/tagLabel', 'flarum/tags/utils/sortTags'], function (_export) {
  'use strict';

  var extract, tagLabel, sortTags;

  _export('default', tagsLabel);

  function tagsLabel(tags) {
    var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var children = [];
    var link = extract(attrs, 'link');

    attrs.className = 'TagsLabel ' + (attrs.className || '');

    if (tags) {
      sortTags(tags).forEach(function (tag) {
        if (tag || tags.length === 1) {
          children.push(tagLabel(tag, { link: link }));
        }
      });
    } else {
      children.push(tagLabel());
    }

    return m(
      'span',
      attrs,
      children
    );
  }

  return {
    setters: [function (_flarumUtilsExtract) {
      extract = _flarumUtilsExtract['default'];
    }, function (_flarumTagsHelpersTagLabel) {
      tagLabel = _flarumTagsHelpersTagLabel['default'];
    }, function (_flarumTagsUtilsSortTags) {
      sortTags = _flarumTagsUtilsSortTags['default'];
    }],
    execute: function () {}
  };
});;System.register("flarum/tags/utils/sortTags", [], function (_export) {
  "use strict";

  _export("default", sortTags);

  function sortTags(tags) {
    return tags.slice(0).sort(function (a, b) {
      var aPos = a.position();
      var bPos = b.position();

      var aParent = a.parent();
      var bParent = b.parent();

      if (aPos === null && bPos === null) {
        return b.discussionsCount() - a.discussionsCount();
      } else if (bPos === null) {
        return -1;
      } else if (aPos === null) {
        return 1;
      } else if (aParent === bParent) {
        return aPos - bPos;
      } else if (aParent) {
        return aParent === b ? 1 : aParent.position() - bPos;
      } else if (bParent) {
        return bParent === a ? -1 : aPos - bParent.position();
      }

      return 0;
    });
  }

  return {
    setters: [],
    execute: function () {}
  };
});;System.register('flarum/tags/addTagComposer', ['flarum/extend', 'flarum/components/IndexPage', 'flarum/components/DiscussionComposer', 'flarum/tags/components/TagDiscussionModal', 'flarum/tags/helpers/tagsLabel'], function (_export) {
  'use strict';

  var extend, override, IndexPage, DiscussionComposer, TagDiscussionModal, tagsLabel;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage['default'];
    }, function (_flarumComponentsDiscussionComposer) {
      DiscussionComposer = _flarumComponentsDiscussionComposer['default'];
    }, function (_flarumTagsComponentsTagDiscussionModal) {
      TagDiscussionModal = _flarumTagsComponentsTagDiscussionModal['default'];
    }, function (_flarumTagsHelpersTagsLabel) {
      tagsLabel = _flarumTagsHelpersTagsLabel['default'];
    }],
    execute: function () {
      _export('default', function () {
        extend(IndexPage.prototype, 'composeNewDiscussion', function (promise) {
          var tag = app.store.getBy('tags', 'slug', this.params().tags);

          if (tag) {
            promise.then(function (component) {
              return component.tags = [tag];
            });
          }
        });

        // Add tag-selection abilities to the discussion composer.
        DiscussionComposer.prototype.tags = [];
        DiscussionComposer.prototype.chooseTags = function () {
          var _this = this;

          app.modal.show(new TagDiscussionModal({
            selectedTags: this.tags.slice(0),
            onsubmit: function onsubmit(tags) {
              _this.tags = tags;
              _this.$('textarea').focus();
            }
          }));
        };

        // Add a tag-selection menu to the discussion composer's header, after the
        // title.
        extend(DiscussionComposer.prototype, 'headerItems', function (items) {
          items.add('tags', m(
            'a',
            { className: 'DiscussionComposer-changeTags', onclick: this.chooseTags.bind(this) },
            this.tags.length ? tagsLabel(this.tags) : m(
              'span',
              { className: 'TagLabel untagged' },
              app.trans('tags.tag_new_discussion_link')
            )
          ), 10);
        });

        override(DiscussionComposer.prototype, 'onsubmit', function (original) {
          var _this2 = this;

          if (!this.tags.length) {
            app.modal.show(new TagDiscussionModal({
              selectedTags: [],
              onsubmit: function onsubmit(tags) {
                _this2.tags = tags;
                original();
              }
            }));
          } else {
            original();
          }
        });

        // Add the selected tags as data to submit to the server.
        extend(DiscussionComposer.prototype, 'data', function (data) {
          data.relationships = data.relationships || {};
          data.relationships.tags = this.tags;
        });
      });
    }
  };
});;System.register('flarum/tags/addTagControl', ['flarum/extend', 'flarum/utils/DiscussionControls', 'flarum/components/Button', 'flarum/tags/components/TagDiscussionModal'], function (_export) {
  'use strict';

  var extend, DiscussionControls, Button, TagDiscussionModal;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumUtilsDiscussionControls) {
      DiscussionControls = _flarumUtilsDiscussionControls['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_flarumTagsComponentsTagDiscussionModal) {
      TagDiscussionModal = _flarumTagsComponentsTagDiscussionModal['default'];
    }],
    execute: function () {
      _export('default', function () {
        // Add a control allowing the discussion to be moved to another category.
        extend(DiscussionControls, 'moderationControls', function (items, discussion) {
          if (discussion.canTag()) {
            items.add('tags', Button.component({
              children: app.trans('tags.edit_discussion_tags_link'),
              icon: 'tag',
              onclick: function onclick() {
                return app.modal.show(new TagDiscussionModal({ discussion: discussion }));
              }
            }));
          }
        });
      });
    }
  };
});;System.register('flarum/tags/addTagFilter', ['flarum/extend', 'flarum/components/IndexPage', 'flarum/components/DiscussionList', 'flarum/tags/components/TagHero'], function (_export) {
  'use strict';

  var extend, override, IndexPage, DiscussionList, TagHero;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage['default'];
    }, function (_flarumComponentsDiscussionList) {
      DiscussionList = _flarumComponentsDiscussionList['default'];
    }, function (_flarumTagsComponentsTagHero) {
      TagHero = _flarumTagsComponentsTagHero['default'];
    }],
    execute: function () {
      _export('default', function () {
        IndexPage.prototype.currentTag = function () {
          var slug = this.params().tags;

          if (slug) return app.store.getBy('tags', 'slug', slug);
        };

        // If currently viewing a tag, insert a tag hero at the top of the view.
        override(IndexPage.prototype, 'hero', function (original) {
          var tag = this.currentTag();

          if (tag) return TagHero.component({ tag: tag });

          return original();
        });

        // If currently viewing a tag, restyle the 'new discussion' button to use
        // the tag's color.
        extend(IndexPage.prototype, 'sidebarItems', function (items) {
          var tag = this.currentTag();

          if (tag) {
            var color = tag.color();

            if (color) {
              items.newDiscussion.content.props.style = { backgroundColor: color };
            }
          }
        });

        // Add a parameter for the IndexPage to pass on to the DiscussionList that
        // will let us filter discussions by tag.
        extend(IndexPage.prototype, 'params', function (params) {
          params.tags = m.route.param('tags');
        });

        // Translate that parameter into a gambit appended to the search query.
        extend(DiscussionList.prototype, 'requestParams', function (params) {
          params.include.push('tags');

          if (this.props.params.tags) {
            params.filter.q = (params.filter.q || '') + ' tag:' + this.props.params.tags;
          }
        });
      });
    }
  };
});;System.register('flarum/tags/addTagLabels', ['flarum/extend', 'flarum/components/DiscussionListItem', 'flarum/components/DiscussionPage', 'flarum/components/DiscussionHero', 'flarum/tags/helpers/tagsLabel', 'flarum/tags/utils/sortTags'], function (_export) {
  'use strict';

  var extend, DiscussionListItem, DiscussionPage, DiscussionHero, tagsLabel, sortTags;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsDiscussionListItem) {
      DiscussionListItem = _flarumComponentsDiscussionListItem['default'];
    }, function (_flarumComponentsDiscussionPage) {
      DiscussionPage = _flarumComponentsDiscussionPage['default'];
    }, function (_flarumComponentsDiscussionHero) {
      DiscussionHero = _flarumComponentsDiscussionHero['default'];
    }, function (_flarumTagsHelpersTagsLabel) {
      tagsLabel = _flarumTagsHelpersTagsLabel['default'];
    }, function (_flarumTagsUtilsSortTags) {
      sortTags = _flarumTagsUtilsSortTags['default'];
    }],
    execute: function () {
      _export('default', function () {
        // Add tag labels to each discussion in the discussion list.
        extend(DiscussionListItem.prototype, 'infoItems', function (items) {
          var tags = this.props.discussion.tags();

          if (tags && tags.length) {
            items.add('tags', tagsLabel(tags), 10);
          }
        });

        // Include a discussion's tags when fetching it.
        extend(DiscussionPage.prototype, 'params', function (params) {
          params.include.push('tags');
        });

        // Restyle a discussion's hero to use its first tag's color.
        extend(DiscussionHero.prototype, 'view', function (view) {
          var tags = sortTags(this.props.discussion.tags());

          if (tags && tags.length) {
            var color = tags[0].color();
            if (color) {
              view.attrs.style = { backgroundColor: color };
              view.attrs.className += ' DiscussionHero--colored';
            }
          }
        });

        // Add a list of a discussion's tags to the discussion hero, displayed
        // before the title. Put the title on its own line.
        extend(DiscussionHero.prototype, 'items', function (items) {
          var tags = this.props.discussion.tags();

          if (tags && tags.length) {
            items.add('tags', tagsLabel(tags, { link: true }), 5);
          }
        });
      });
    }
  };
});;System.register('flarum/tags/addTagList', ['flarum/extend', 'flarum/components/IndexPage', 'flarum/components/Separator', 'flarum/components/LinkButton', 'flarum/tags/components/TagLinkButton', 'flarum/tags/components/TagsPage', 'flarum/tags/utils/sortTags'], function (_export) {
  'use strict';

  var extend, IndexPage, Separator, LinkButton, TagLinkButton, TagsPage, sortTags;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage['default'];
    }, function (_flarumComponentsSeparator) {
      Separator = _flarumComponentsSeparator['default'];
    }, function (_flarumComponentsLinkButton) {
      LinkButton = _flarumComponentsLinkButton['default'];
    }, function (_flarumTagsComponentsTagLinkButton) {
      TagLinkButton = _flarumTagsComponentsTagLinkButton['default'];
    }, function (_flarumTagsComponentsTagsPage) {
      TagsPage = _flarumTagsComponentsTagsPage['default'];
    }, function (_flarumTagsUtilsSortTags) {
      sortTags = _flarumTagsUtilsSortTags['default'];
    }],
    execute: function () {
      _export('default', function () {
        // Add a link to the tags page, as well as a list of all the tags,
        // to the index page's sidebar.
        extend(IndexPage.prototype, 'navItems', function (items) {
          items.add('tags', LinkButton.component({
            icon: 'th-large',
            children: app.trans('tags.tags'),
            href: app.route('tags')
          }), -10);

          if (app.current instanceof TagsPage) return;

          items.add('separator', Separator.component(), -10);

          var params = this.stickyParams();
          var tags = app.store.all('tags');
          var currentTag = this.currentTag();

          var addTag = function addTag(tag) {
            var active = currentTag === tag;

            if (!active && currentTag) {
              active = currentTag.parent() === tag;
            }

            items.add('tag' + tag.id(), TagLinkButton.component({ tag: tag, params: params, active: active }), -10);
          };

          sortTags(tags).filter(function (tag) {
            return tag.position() !== null && (!tag.isChild() || currentTag && (tag.parent() === currentTag || tag.parent() === currentTag.parent()));
          }).forEach(addTag);

          var more = tags.filter(function (tag) {
            return tag.position() === null;
          }).sort(function (a, b) {
            return b.discussionsCount() - a.discussionsCount();
          });

          more.splice(0, 3).forEach(addTag);

          if (more.length) {
            items.add('moreTags', LinkButton.component({
              children: app.trans('tags.more'),
              href: app.route('tags')
            }), -10);
          }
        });
      });
    }
  };
});;System.register('flarum/tags/main', ['flarum/Model', 'flarum/models/Discussion', 'flarum/components/IndexPage', 'flarum/tags/models/Tag', 'flarum/tags/components/TagsPage', 'flarum/tags/components/DiscussionTaggedPost', 'flarum/tags/addTagList', 'flarum/tags/addTagFilter', 'flarum/tags/addTagLabels', 'flarum/tags/addTagControl', 'flarum/tags/addTagComposer'], function (_export) {
  'use strict';

  var Model, Discussion, IndexPage, Tag, TagsPage, DiscussionTaggedPost, addTagList, addTagFilter, addTagLabels, addTagControl, addTagComposer;
  return {
    setters: [function (_flarumModel) {
      Model = _flarumModel['default'];
    }, function (_flarumModelsDiscussion) {
      Discussion = _flarumModelsDiscussion['default'];
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage['default'];
    }, function (_flarumTagsModelsTag) {
      Tag = _flarumTagsModelsTag['default'];
    }, function (_flarumTagsComponentsTagsPage) {
      TagsPage = _flarumTagsComponentsTagsPage['default'];
    }, function (_flarumTagsComponentsDiscussionTaggedPost) {
      DiscussionTaggedPost = _flarumTagsComponentsDiscussionTaggedPost['default'];
    }, function (_flarumTagsAddTagList) {
      addTagList = _flarumTagsAddTagList['default'];
    }, function (_flarumTagsAddTagFilter) {
      addTagFilter = _flarumTagsAddTagFilter['default'];
    }, function (_flarumTagsAddTagLabels) {
      addTagLabels = _flarumTagsAddTagLabels['default'];
    }, function (_flarumTagsAddTagControl) {
      addTagControl = _flarumTagsAddTagControl['default'];
    }, function (_flarumTagsAddTagComposer) {
      addTagComposer = _flarumTagsAddTagComposer['default'];
    }],
    execute: function () {

      app.initializers.add('tags', function (app) {
        app.routes.tags = { path: '/tags', component: TagsPage.component() };
        app.routes.tag = { path: '/t/:tags', component: IndexPage.component() };

        app.route.tag = function (tag) {
          return app.route('tag', { tags: tag.slug() });
        };

        app.postComponents.discussionTagged = DiscussionTaggedPost;

        app.store.models.tags = Tag;

        Discussion.prototype.tags = Model.hasMany('tags');
        Discussion.prototype.canTag = Model.attribute('canTag');

        addTagList();
        addTagFilter();
        addTagLabels();
        addTagControl();
        addTagComposer();
      });
    }
  };
});;System.register('flarum/tags/components/DiscussionTaggedPost', ['flarum/components/EventPost', 'flarum/helpers/punctuateSeries', 'flarum/tags/helpers/tagsLabel'], function (_export) {
  'use strict';

  var EventPost, punctuateSeries, tagsLabel, DiscussionTaggedPost;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_flarumComponentsEventPost) {
      EventPost = _flarumComponentsEventPost['default'];
    }, function (_flarumHelpersPunctuateSeries) {
      punctuateSeries = _flarumHelpersPunctuateSeries['default'];
    }, function (_flarumTagsHelpersTagsLabel) {
      tagsLabel = _flarumTagsHelpersTagsLabel['default'];
    }],
    execute: function () {
      DiscussionTaggedPost = (function (_EventPost) {
        _inherits(DiscussionTaggedPost, _EventPost);

        function DiscussionTaggedPost() {
          _classCallCheck(this, DiscussionTaggedPost);

          _get(Object.getPrototypeOf(DiscussionTaggedPost.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(DiscussionTaggedPost, [{
          key: 'icon',
          value: function icon() {
            return 'tag';
          }
        }, {
          key: 'descriptionKey',
          value: function descriptionKey() {
            return 'tags.discussion_tagged_post';
          }
        }, {
          key: 'descriptionData',
          value: function descriptionData() {
            var post = this.props.post;
            var oldTags = post.content()[0];
            var newTags = post.content()[1];

            function diffTags(tags1, tags2) {
              return tags1.filter(function (tag) {
                return tags2.indexOf(tag) === -1;
              }).map(function (id) {
                return app.store.getById('tags', id);
              });
            }

            var added = diffTags(newTags, oldTags);
            var removed = diffTags(oldTags, newTags);
            var actions = [];

            if (added.length) {
              actions.push(app.trans('tags.added_tags', {
                tags: tagsLabel(added, { link: true }),
                count: added
              }));
            }

            if (removed.length) {
              actions.push(app.trans('tags.removed_tags', {
                tags: tagsLabel(removed, { link: true }),
                count: removed
              }));
            }

            return {
              action: punctuateSeries(actions),
              count: added.length + removed.length
            };
          }
        }]);

        return DiscussionTaggedPost;
      })(EventPost);

      _export('default', DiscussionTaggedPost);
    }
  };
});;System.register('flarum/tags/components/TagDiscussionModal', ['flarum/components/Modal', 'flarum/components/DiscussionPage', 'flarum/components/Button', 'flarum/helpers/highlight', 'flarum/utils/classList', 'flarum/utils/extractText', 'flarum/tags/helpers/tagLabel', 'flarum/tags/helpers/tagIcon', 'flarum/tags/utils/sortTags'], function (_export) {
  'use strict';

  var Modal, DiscussionPage, Button, highlight, classList, extractText, tagLabel, tagIcon, sortTags, TagDiscussionModal;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal['default'];
    }, function (_flarumComponentsDiscussionPage) {
      DiscussionPage = _flarumComponentsDiscussionPage['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_flarumHelpersHighlight) {
      highlight = _flarumHelpersHighlight['default'];
    }, function (_flarumUtilsClassList) {
      classList = _flarumUtilsClassList['default'];
    }, function (_flarumUtilsExtractText) {
      extractText = _flarumUtilsExtractText['default'];
    }, function (_flarumTagsHelpersTagLabel) {
      tagLabel = _flarumTagsHelpersTagLabel['default'];
    }, function (_flarumTagsHelpersTagIcon) {
      tagIcon = _flarumTagsHelpersTagIcon['default'];
    }, function (_flarumTagsUtilsSortTags) {
      sortTags = _flarumTagsUtilsSortTags['default'];
    }],
    execute: function () {
      TagDiscussionModal = (function (_Modal) {
        _inherits(TagDiscussionModal, _Modal);

        function TagDiscussionModal() {
          _classCallCheck(this, TagDiscussionModal);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _get(Object.getPrototypeOf(TagDiscussionModal.prototype), 'constructor', this).apply(this, args);

          this.tags = sortTags(app.store.all('tags').filter(function (tag) {
            return tag.canStartDiscussion();
          }));

          this.selected = [];
          this.filter = m.prop('');
          this.index = this.tags[0].id();
          this.focused = false;

          if (this.props.selectedTags) {
            this.props.selectedTags.map(this.addTag.bind(this));
          } else if (this.props.discussion) {
            this.props.discussion.tags().map(this.addTag.bind(this));
          }

          this.minPrimary = app.forum.attribute('minPrimaryTags');
          this.maxPrimary = app.forum.attribute('maxPrimaryTags');
          this.minSecondary = app.forum.attribute('minSecondaryTags');
          this.maxSecondary = app.forum.attribute('maxSecondaryTags');
        }

        _createClass(TagDiscussionModal, [{
          key: 'primaryCount',
          value: function primaryCount() {
            return this.selected.filter(function (tag) {
              return tag.isPrimary();
            }).length;
          }
        }, {
          key: 'secondaryCount',
          value: function secondaryCount() {
            return this.selected.filter(function (tag) {
              return !tag.isPrimary();
            }).length;
          }

          /**
           * Add the given tag to the list of selected tags.
           *
           * @param {Tag} tag
           */
        }, {
          key: 'addTag',
          value: function addTag(tag) {
            if (!tag.canStartDiscussion()) return;

            // If this tag has a parent, we'll also need to add the parent tag to the
            // selected list if it's not already in there.
            var parent = tag.parent();
            if (parent) {
              var index = this.selected.indexOf(parent);
              if (index === -1) {
                this.selected.push(parent);
              }
            }

            this.selected.push(tag);
          }

          /**
           * Remove the given tag from the list of selected tags.
           *
           * @param {Tag} tag
           */
        }, {
          key: 'removeTag',
          value: function removeTag(tag) {
            var index = this.selected.indexOf(tag);
            if (index !== -1) {
              this.selected.splice(index, 1);

              // Look through the list of selected tags for any tags which have the tag
              // we just removed as their parent. We'll need to remove them too.
              this.selected.filter(function (selected) {
                return selected.parent() === tag;
              }).forEach(this.removeTag.bind(this));
            }
          }
        }, {
          key: 'className',
          value: function className() {
            return 'TagDiscussionModal';
          }
        }, {
          key: 'title',
          value: function title() {
            return this.props.discussion ? app.trans('tags.edit_discussion_tags_title', { title: m(
                'em',
                null,
                this.props.discussion.title()
              ) }) : app.trans('tags.tag_new_discussion_title');
          }
        }, {
          key: 'getInstruction',
          value: function getInstruction(primaryCount, secondaryCount) {
            if (primaryCount < this.minPrimary) {
              return app.trans('tags.choose_primary_tags', { count: this.minPrimary - primaryCount });
            } else if (secondaryCount < this.minSecondary) {
              return app.trans('tags.choose_secondary_tags', { count: this.minSecondary - secondaryCount });
            }

            return '';
          }
        }, {
          key: 'content',
          value: function content() {
            var _this = this;

            var tags = this.tags;
            var filter = this.filter().toLowerCase();
            var primaryCount = this.primaryCount();
            var secondaryCount = this.secondaryCount();

            // Filter out all child tags whose parents have not been selected. This
            // makes it impossible to select a child if its parent hasn't been selected.
            tags = tags.filter(function (tag) {
              var parent = tag.parent();
              return parent === false || _this.selected.indexOf(parent) !== -1;
            });

            // If the number of selected primary/secondary tags is at the maximum, then
            // we'll filter out all other tags of that type.
            if (primaryCount >= app.forum.attribute('maxPrimaryTags')) {
              tags = tags.filter(function (tag) {
                return !tag.isPrimary() || _this.selected.indexOf(tag) !== -1;
              });
            }

            if (secondaryCount >= app.forum.attribute('maxSecondaryTags')) {
              tags = tags.filter(function (tag) {
                return tag.isPrimary() || _this.selected.indexOf(tag) !== -1;
              });
            }

            // If the user has entered text in the filter input, then filter by tags
            // whose name matches what they've entered.
            if (filter) {
              tags = tags.filter(function (tag) {
                return tag.name().substr(0, filter.length).toLowerCase() === filter;
              });
            }

            if (tags.indexOf(this.index) === -1) this.index = tags[0];

            return [m(
              'div',
              { className: 'Modal-body' },
              m(
                'div',
                { className: 'TagDiscussionModal-form' },
                m(
                  'div',
                  { className: 'TagDiscussionModal-form-input' },
                  m(
                    'div',
                    { className: 'TagsInput FormControl ' + (this.focused ? 'focus' : '') },
                    m(
                      'span',
                      { className: 'TagsInput-selected' },
                      this.selected.map(function (tag) {
                        return m(
                          'span',
                          { className: 'TagsInput-tag', onclick: function () {
                              _this.removeTag(tag);
                              _this.onready();
                            } },
                          tagLabel(tag)
                        );
                      })
                    ),
                    m('input', { className: 'FormControl',
                      placeholder: extractText(this.getInstruction(primaryCount, secondaryCount)),
                      value: this.filter(),
                      oninput: m.withAttr('value', this.filter),
                      onkeydown: this.onkeydown.bind(this),
                      onfocus: function () {
                        return _this.focused = true;
                      },
                      onblur: function () {
                        return _this.focused = false;
                      } })
                  )
                ),
                m(
                  'div',
                  { className: 'TagDiscussionModal-form-submit App-primaryControl' },
                  Button.component({
                    type: 'submit',
                    className: 'Button Button--primary',
                    disabled: primaryCount < this.minPrimary || secondaryCount < this.minSecondary,
                    icon: 'check',
                    children: app.trans('tags.confirm')
                  })
                )
              )
            ), m(
              'div',
              { className: 'Modal-footer' },
              m(
                'ul',
                { className: 'TagDiscussionModal-list SelectTagList' },
                tags.filter(function (tag) {
                  return filter || !tag.parent() || _this.selected.indexOf(tag.parent()) !== -1;
                }).map(function (tag) {
                  return m(
                    'li',
                    { 'data-index': tag.id(),
                      className: classList({
                        pinned: tag.position() !== null,
                        child: !!tag.parent(),
                        colored: !!tag.color(),
                        selected: _this.selected.indexOf(tag) !== -1,
                        active: _this.index === tag
                      }),
                      style: { color: tag.color() },
                      onmouseover: function () {
                        return _this.index = tag;
                      },
                      onclick: _this.toggleTag.bind(_this, tag)
                    },
                    tagIcon(tag),
                    m(
                      'span',
                      { className: 'SelectTagListItem-name' },
                      highlight(tag.name(), filter)
                    ),
                    tag.description() ? m(
                      'span',
                      { className: 'SelectTagListItem-description' },
                      tag.description()
                    ) : ''
                  );
                })
              )
            )];
          }
        }, {
          key: 'toggleTag',
          value: function toggleTag(tag) {
            var index = this.selected.indexOf(tag);

            if (index !== -1) {
              this.removeTag(tag);
            } else {
              this.addTag(tag);
            }

            if (this.filter()) {
              this.filter('');
              this.index = this.tags[0];
            }

            this.onready();
          }
        }, {
          key: 'onkeydown',
          value: function onkeydown(e) {
            switch (e.which) {
              case 40:
              case 38:
                // Down/Up
                e.preventDefault();
                this.setIndex(this.getCurrentNumericIndex() + (e.which === 40 ? 1 : -1), true);
                break;

              case 13:
                // Return
                e.preventDefault();
                if (e.metaKey || e.ctrlKey || this.selected.indexOf(this.index) !== -1) {
                  if (this.selected.length) {
                    this.$('form').submit();
                  }
                } else {
                  this.getItem(this.index)[0].dispatchEvent(new Event('click'));
                }
                break;

              case 8:
                // Backspace
                if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
                  e.preventDefault();
                  this.selected.splice(this.selected.length - 1, 1);
                }
                break;

              default:
              // no default
            }
          }
        }, {
          key: 'selectableItems',
          value: function selectableItems() {
            return this.$('.TagDiscussionModal-list > li');
          }
        }, {
          key: 'getCurrentNumericIndex',
          value: function getCurrentNumericIndex() {
            return this.selectableItems().index(this.getItem(this.index));
          }
        }, {
          key: 'getItem',
          value: function getItem(index) {
            return this.selectableItems().filter('[data-index="' + index.id() + '"]');
          }
        }, {
          key: 'setIndex',
          value: function setIndex(index, scrollToItem) {
            var $items = this.selectableItems();
            var $dropdown = $items.parent();

            if (index < 0) {
              index = $items.length - 1;
            } else if (index >= $items.length) {
              index = 0;
            }

            var $item = $items.eq(index);

            this.index = app.store.getById('tags', $item.attr('data-index'));

            m.redraw();

            if (scrollToItem) {
              var dropdownScroll = $dropdown.scrollTop();
              var dropdownTop = $dropdown.offset().top;
              var dropdownBottom = dropdownTop + $dropdown.outerHeight();
              var itemTop = $item.offset().top;
              var itemBottom = itemTop + $item.outerHeight();

              var scrollTop = undefined;
              if (itemTop < dropdownTop) {
                scrollTop = dropdownScroll - dropdownTop + itemTop - parseInt($dropdown.css('padding-top'), 10);
              } else if (itemBottom > dropdownBottom) {
                scrollTop = dropdownScroll - dropdownBottom + itemBottom + parseInt($dropdown.css('padding-bottom'), 10);
              }

              if (typeof scrollTop !== 'undefined') {
                $dropdown.stop(true).animate({ scrollTop: scrollTop }, 100);
              }
            }
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            e.preventDefault();

            var discussion = this.props.discussion;
            var tags = this.selected;

            if (discussion) {
              discussion.save({ relationships: { tags: tags } }).then(function () {
                if (app.current instanceof DiscussionPage) {
                  app.current.stream.update();
                }
                m.redraw();
              });
            }

            if (this.props.onsubmit) this.props.onsubmit(tags);

            app.modal.close();

            m.redraw.strategy('none');
          }
        }]);

        return TagDiscussionModal;
      })(Modal);

      _export('default', TagDiscussionModal);
    }
  };
});;System.register('flarum/tags/components/TagHero', ['flarum/Component'], function (_export) {
  'use strict';

  var Component, TagHero;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent['default'];
    }],
    execute: function () {
      TagHero = (function (_Component) {
        _inherits(TagHero, _Component);

        function TagHero() {
          _classCallCheck(this, TagHero);

          _get(Object.getPrototypeOf(TagHero.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(TagHero, [{
          key: 'view',
          value: function view() {
            var tag = this.props.tag;
            var color = tag.color();

            return m(
              'header',
              { className: 'Hero TagHero',
                style: color ? { color: '#fff', backgroundColor: color } : '' },
              m(
                'div',
                { className: 'container' },
                m(
                  'div',
                  { className: 'containerNarrow' },
                  m(
                    'h2',
                    { className: 'Hero-title' },
                    tag.name()
                  ),
                  m(
                    'div',
                    { className: 'Hero-subtitle' },
                    tag.description()
                  )
                )
              )
            );
          }
        }]);

        return TagHero;
      })(Component);

      _export('default', TagHero);
    }
  };
});;System.register('flarum/tags/components/TagLinkButton', ['flarum/components/LinkButton', 'flarum/tags/helpers/tagIcon'], function (_export) {
  'use strict';

  var LinkButton, tagIcon, TagLinkButton;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_flarumComponentsLinkButton) {
      LinkButton = _flarumComponentsLinkButton['default'];
    }, function (_flarumTagsHelpersTagIcon) {
      tagIcon = _flarumTagsHelpersTagIcon['default'];
    }],
    execute: function () {
      TagLinkButton = (function (_LinkButton) {
        _inherits(TagLinkButton, _LinkButton);

        function TagLinkButton() {
          _classCallCheck(this, TagLinkButton);

          _get(Object.getPrototypeOf(TagLinkButton.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(TagLinkButton, [{
          key: 'view',
          value: function view() {
            var tag = this.props.tag;
            var active = this.constructor.isActive(this.props);
            var description = tag && tag.description();

            return m(
              'a',
              { className: 'TagLinkButton hasIcon ' + (tag.isChild() ? 'child' : ''), href: this.props.href, config: m.route,
                style: active && tag ? { color: tag.color() } : '',
                title: description || '' },
              tagIcon(tag, { className: 'Button-icon' }),
              this.props.children
            );
          }
        }], [{
          key: 'initProps',
          value: function initProps(props) {
            var tag = props.tag;

            props.params.tags = tag ? tag.slug() : 'untagged';
            props.href = app.route('tag', props.params);
            props.children = tag ? tag.name() : app.trans('tags.untagged');
          }
        }]);

        return TagLinkButton;
      })(LinkButton);

      _export('default', TagLinkButton);
    }
  };
});;System.register('flarum/tags/components/TagsPage', ['flarum/Component', 'flarum/components/IndexPage', 'flarum/helpers/listItems', 'flarum/helpers/humanTime', 'flarum/tags/helpers/tagLabel', 'flarum/tags/utils/sortTags'], function (_export) {
  'use strict';

  var Component, IndexPage, listItems, humanTime, tagLabel, sortTags, TagsPage;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent['default'];
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage['default'];
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems['default'];
    }, function (_flarumHelpersHumanTime) {
      humanTime = _flarumHelpersHumanTime['default'];
    }, function (_flarumTagsHelpersTagLabel) {
      tagLabel = _flarumTagsHelpersTagLabel['default'];
    }, function (_flarumTagsUtilsSortTags) {
      sortTags = _flarumTagsUtilsSortTags['default'];
    }],
    execute: function () {
      TagsPage = (function (_Component) {
        _inherits(TagsPage, _Component);

        function TagsPage() {
          _classCallCheck(this, TagsPage);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _get(Object.getPrototypeOf(TagsPage.prototype), 'constructor', this).apply(this, args);

          this.tags = sortTags(app.store.all('tags').filter(function (tag) {
            return !tag.parent();
          }));

          app.current = this;
          app.history.push('tags');
          app.drawer.hide();
          app.modal.close();
        }

        _createClass(TagsPage, [{
          key: 'view',
          value: function view() {
            var pinned = this.tags.filter(function (tag) {
              return tag.position() !== null;
            });
            var cloud = this.tags.filter(function (tag) {
              return tag.position() === null;
            });

            return m(
              'div',
              { className: 'TagsPage' },
              IndexPage.prototype.hero(),
              m(
                'div',
                { className: 'container' },
                m(
                  'nav',
                  { className: 'TagsPage-nav IndexPage-nav sideNav', config: IndexPage.prototype.affixSidebar },
                  m(
                    'ul',
                    null,
                    listItems(IndexPage.prototype.sidebarItems().toArray())
                  )
                ),
                m(
                  'div',
                  { className: 'TagsPage-content sideNavOffset' },
                  m(
                    'ul',
                    { className: 'TagTiles' },
                    pinned.map(function (tag) {
                      var lastDiscussion = tag.lastDiscussion();
                      var children = app.store.all('tags').filter(function (child) {
                        return child.parent() === tag;
                      });

                      return m(
                        'li',
                        { className: 'TagTile ' + (tag.color() ? 'colored' : ''),
                          style: { backgroundColor: tag.color() } },
                        m(
                          'a',
                          { className: 'TagTile-info', href: app.route.tag(tag), config: m.route },
                          m(
                            'h3',
                            { className: 'TagTile-name' },
                            tag.name()
                          ),
                          m(
                            'p',
                            { className: 'TagTile-description' },
                            tag.description()
                          ),
                          children ? m(
                            'div',
                            { className: 'TagTile-children' },
                            children.map(function (child) {
                              return m(
                                'a',
                                { href: app.route.tag(child), config: function (element, isInitialized) {
                                    if (isInitialized) return;
                                    $(element).on('click', function (e) {
                                      return e.stopPropagation();
                                    });
                                    m.route.apply(this, arguments);
                                  } },
                                child.name()
                              );
                            })
                          ) : ''
                        ),
                        lastDiscussion ? m(
                          'a',
                          { className: 'TagTile-lastDiscussion',
                            href: app.route.discussion(lastDiscussion, lastDiscussion.lastPostNumber()),
                            config: m.route },
                          m(
                            'span',
                            { className: 'TagTile-lastDiscussion-title' },
                            lastDiscussion.title()
                          ),
                          humanTime(lastDiscussion.lastTime())
                        ) : m('span', { className: 'TagTile-lastDiscussion' })
                      );
                    })
                  ),
                  cloud.length ? m(
                    'div',
                    { className: 'TagCloud' },
                    cloud.map(function (tag) {
                      var color = tag.color();

                      return [tagLabel(tag, { link: true }), ' '];
                    })
                  ) : ''
                )
              )
            );
          }
        }]);

        return TagsPage;
      })(Component);

      _export('default', TagsPage);
    }
  };
});