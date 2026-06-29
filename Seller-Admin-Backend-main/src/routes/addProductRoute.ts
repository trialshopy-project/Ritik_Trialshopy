import { Router } from "express";
import { addProductController } from "../controllers/addProductController";

export class addProductRoute {
    static addProduct() {
        const router = Router();
        router.route('/add/:sellerId').post(addProductController.addProduct);
        router.route('/generate-description').post(addProductController.generateDescription);
        return router;
    }
}
