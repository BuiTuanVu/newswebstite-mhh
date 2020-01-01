var express = require('express');
var router = express.Router();
var tagModel = require('../../models/tag.model')

router.get('/', (req, res) => {
    tagModel.all().then(tags => {
        res.render('admin/vwAdmin/tags_admin', { layout: 'admin', tags })
    })
});
router.post('/', (req, res) => {
    var entity = {
        tag_name: req.body.TagName,
        tag_des: req.body.TagDes,
        tag_slug: req.body.TagSlug,
    }
    tagModel.add(entity).then(rows => {
        res.redirect('/admin/tags');
    })
})

module.exports = router;