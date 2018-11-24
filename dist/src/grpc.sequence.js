"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const grpc_bindings_1 = require("./grpc.bindings");
let GrpcSequence = class GrpcSequence {
    constructor(controller, method) {
        this.controller = controller;
        this.method = method;
    }
    async wrapUnaryCall(call) {
        // Do something before call
        const reply = await this.controller[this.method](call.request);
        // Do something after call
        return reply;
    }
    async wrapClientStreamingCall(call) {
        // Do something before call
        const reply = await this.controller[this.method](call);
        // Do something after call
        return reply;
    }
    wrapServerStreamingCall(call) {
        // Do something before call
        this.controller[this.method](call);
        // Do something after call
    }
    wrapBidiStreamingCall(call) {
        // Do something before call
        this.controller[this.method](call);
        // Do something after call
    }
};
GrpcSequence = __decorate([
    __param(0, core_1.inject(grpc_bindings_1.GrpcBindings.TEMP_CONTROLLER)),
    __param(1, core_1.inject(grpc_bindings_1.GrpcBindings.TEMP_METHOD_NAME)),
    __metadata("design:paramtypes", [Object, String])
], GrpcSequence);
exports.GrpcSequence = GrpcSequence;
// tslint:enable:no-any
//# sourceMappingURL=grpc.sequence.js.map