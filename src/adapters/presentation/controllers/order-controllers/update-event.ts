import { MissingParamError } from "../errors/missing-param-error";
import { Request } from "../ports/request";
import { Response } from "../ports/response";
import { badRequest, ok, serverError } from "../helpers/response-helper";
import { getKeys as getOrderDataKeys } from "../../../../entites/order/order-data";
import { UpdateOrder } from "../../../../useCases/order/update-order-data/update-order";
import { Order } from "../../../../entites/order/order";
import { UpdateOrderResponse } from "../../../../useCases/order/update-order-data/update-order-response";

function checkDataObjectFields(object: any): string | undefined {
  const props = getOrderDataKeys();
  const missingField = props.find(
    (prop) => !object[prop] && object[prop] !== 0
  );
  return missingField;
}

export class UpdateOrderController {
  private readonly updateOrderData: UpdateOrder;

  constructor(updateOrderData: UpdateOrder) {
    this.updateOrderData = updateOrderData;
  }

  handle(requestData: Request): Response | Error {
    try {
      const missingField = checkDataObjectFields(requestData.data);
      if (missingField) {
        const missingParamError = new MissingParamError(missingField);
        return badRequest(missingParamError);
      }
      if (!requestData.data.id) {
        const missingParamError = new MissingParamError("id");
        return badRequest(missingParamError);
      }

      const orderData = requestData.data as Order;

      const updateOrderResponse: UpdateOrderResponse =
        this.updateOrderData.updateOrderData(orderData);

      if (updateOrderResponse instanceof Error) {
        return badRequest(updateOrderResponse);
      }
      return ok(orderData);
    } catch (error) {
      return serverError("internal");
    }
  }
}
