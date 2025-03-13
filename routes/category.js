var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');

router.get('/', async function(req, res, next) {
  try {
    let categories = await categoryModel.find({ isDeleted: false });
    CreateSuccessRes(res, categories, 200);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let category = await categoryModel.findOne({ _id: req.params.id, isDeleted: false });
    if (!category) return CreateErrorRes(res, 'Category not found', 404);
    CreateSuccessRes(res, category, 200);
  } catch (error) {
    next(error);
  }
});

router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let newCategory = new categoryModel({
      name: body.name,
      description: body.description
    });
    await newCategory.save();
    CreateSuccessRes(res, newCategory, 201);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let updatedInfo = {};
    
    if (body.name) updatedInfo.name = body.name;
    if (body.description) updatedInfo.description = body.description;

    let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, updatedInfo, { new: true });
    if (!updatedCategory) return CreateErrorRes(res, 'Category not found', 404);

    CreateSuccessRes(res, updatedCategory, 200);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!updatedCategory) return CreateErrorRes(res, 'Category not found', 404);

    CreateSuccessRes(res, updatedCategory, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
