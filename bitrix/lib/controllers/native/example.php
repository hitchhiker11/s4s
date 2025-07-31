<?php
/*
 * ********************************************************************************************
 *
 *                                      Artamonov REST module                                   
 *      Module helps to organize a program interface for external and internal applications.
 *
 *      file             : example.php
 *      modified         : 01.08.2022
 *
 *      package          : bitrix
 *      subpackage       : artamonov.rest
 *      link             : https://marketplace.1c-bitrix.ru/solutions/artamonov.rest
 *
 *      author           : Denis Artamonov
 *      authorEmail      : artamonov.d.i@yandex.com
 *      authorUrl        : https://artamonov.pro
 *
 *      company          : Webco - web solutions development company
 *      companyEmail     : hello@webco.io
 *      companyUrl       : https://webco.io
 *      partnerUrl       : https://www.1c-bitrix.ru/partners/1469188.php
 *      marketplaceUrl   : https://marketplace.1c-bitrix.ru/partners/detail.php?ID=1469188.php
 *
 *      copyright        : 2018 - 2022 Webco company
 *      license          : https://partners.1c-bitrix.ru/license.php?module=artamonov.rest
 *
 *      This program is not free software, you cannot distribute and / or modify it.
 *
 * ********************************************************************************************
 */


namespace Artamonov\Rest\Controllers\Native;


class Example
{
    public function __construct()
    {
        if (!config()->get('useExampleRoute')) {
            response()->json('Showing examples is disabled in the settings');
        }
    }

    public function _get()
    {
        $this->response(__FUNCTION__);
    }

    public function _post()
    {
        $this->response(__FUNCTION__);
    }

    public function _put()
    {
        $this->response(__FUNCTION__);
    }

    public function _delete()
    {
        $this->response(__FUNCTION__);
    }

    public function _head()
    {
        $this->response(__FUNCTION__);
    }

    private function response($action)
    {
        $response = [
            'message' => 'Запрос выполнен успешно',
            'date' => date('Y-m-d H:i:s'),
            'controller' => __CLASS__,
            'action' => $action,
            'method' => request()->method(),
            'header' => request()->header(),
            'request' => request()->get(),
            'server' => $_SERVER,
        ];
        journal()->add('request-response', ['request' => request()->get(), 'response' => $response]);

        response()->json($response);

        // Заголовок - простой строкой
        //response()->json($response, 200, [], ['test-header' => 'test:test']);

        // Заголовок с поддержкой параметров - доступно с версии модуля 4.4.0
        /*response()->json($response, 200, [],
            // Дополнительные заголовки для ответа клиенту
            [
                // Описание из документации: https://www.php.net/manual/ru/function.header.php
                'test-header' => [ // название заголовка
                    'value' => 'value-header', // значение заголовка
                    'replace' => true, // true | false, - параметр заголовка
                    'http_response_code' => 302 // - параметр заголовка
                ]
            ]
        );*/
    }
}
