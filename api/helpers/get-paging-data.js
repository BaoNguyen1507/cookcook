module.exports = {
  
  friendlyName: 'Generate paging data object',
  description: 'Generate paging data object.',

  inputs: { 
    url: {
      type: 'string',
      description: 'url of paging'
    },
    page: {
      type: 'string',
      description: 'current page'
    },
    totals: {
      type: 'number',
      description: 'totals of records'
    },
    limit: {
      type: 'number',
      description: 'limit of one page'
    }
  },
  exits: {
    success: {}
  },
  
  fn: async function (inputs, exits) {
    
    return exits.success({
      url: inputs.url,
      page: inputs.page,
      from: (inputs.totals ? ((inputs.page - 1) * inputs.limit) + 1 : 0),
      to: ((((inputs.page - 1) * inputs.limit) > (inputs.totals - inputs.limit)) ? inputs.totals : (((inputs.page - 1) * inputs.limit) + inputs.limit)),
      total: inputs.totals,
      pages: (Math.ceil(inputs.totals / inputs.limit))
    });

  }

};