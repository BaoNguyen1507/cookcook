module.exports = {

    attributes: {
        title: {
            type: 'string',
            required: true
        },
        message: {
            required: true,
            type: 'string',
        },
        status: {
            type: 'number',
            isIn: [sails.config.custom.STATUS.TRASH, sails.config.custom.STATUS.DRAFT, sails.config.custom.STATUS.ACTIVE],
            defaultsTo: sails.config.custom.STATUS.DRAFT
        },
        type: {
            type: 'number',
            isIn: [sails.config.custom.TYPE.NEWS_PRIVATE, sails.config.custom.TYPE.NEWS_PUBLIC, sails.config.custom.TYPE.FEE_INVOICE, sails.config.custom.TYPE.ALBUM, sails.config.custom.TYPE.MENU, sails.config.custom.TYPE.SUBJECT, sails.config.custom.TYPE.ATTENDENT, sails.config.custom.TYPE.DAY_OFF,sails.config.custom.TYPE.PICK_UP,],
            defaultsTo: sails.config.custom.TYPE.NEWS_PRIVATE
        },
    },
};
