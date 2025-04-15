const express = require('express');
const router = express.Router();

const entityControllers = require('@/controllers/entity/index');


function createRoutes(controllerBox, prefix) {
  Object.keys(controllerBox).forEach((key) => {   
    const { findAll, findOne, create, update, remove, paginate } = controllerBox[key];
    
    if (findAll) router.get(`/${prefix}/${key.split('C')[0]}/readAll`, findAll);
    if (findOne) router.get(`/${prefix}/${key.split('C')[0]}/readOne`,findOne);
    if (create) router.post(`/${prefix}/${key.split('C')[0]}/create`, create);
    if (update) router.put(`/${prefix}/${key.split('C')[0]}/update`, update);
    if (remove) router.delete(`/${prefix}/${key.split('C')[0]}/remove`, remove);
    if (paginate) router.get(`/${prefix}/${key.split('C')[0]}/paginate`, paginate);
  });
}

createRoutes(entityControllers, 'entity');

module.exports = router;
 