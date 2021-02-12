export function validate(schema, reqPart = "body") {
  
  return (req, res, next) => {

    const validateResult = schema.validate(req[reqPart]);

    if(validateResult.error){
      return res.status(400).send(validateResult.error);
    }

    next();
  }
}