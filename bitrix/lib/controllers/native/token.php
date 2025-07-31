<?php
/*
 * ********************************************************************************************
 *
 *                                      Artamonov REST module
 *      Module helps to organize a program interface for external and internal applications.
 *
 *      file             : token.php
 *      modified         : 02.08.2022
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


use Artamonov\Rest\Foundation\Security\Password;
use Bitrix\Main\ArgumentException;
use Bitrix\Main\ObjectPropertyException;
use Bitrix\Main\SystemException;
use Bitrix\Main\UserTable;
use CUser;

class Token
{
    private $user;

    public function __construct()
    {
        if (!config()->get('useNativeRoute')) {
            response()->json('The use of native routes is disabled in the settings');
        }
    }

    /**
     * Создать токен для пользователя
     */
    public function create()
    {
        $user = new CUser();
        $token = helper()->generateToken($this->user()['ID'], $this->user()['LOGIN']);
        $expire = settings()->getTokenExpire();
        $user->update($this->user()['ID'], [
            settings()->getTokenFieldCode() => $token,
            settings()->getTokenExpireFieldCode() => $expire
        ]);
        $response = [
            'token' => $token,
            'expire' => $expire
        ];
        journal()->add('request-response', [
            'request' => request()->get(),
            'response' => $response
        ]);
        response()->created($response);
    }

    /**
     * Получить информацию о токене пользователя
     */
    public function get()
    {
        $response = [
            'token' => $this->user()[settings()->getTokenFieldCode()] ? $this->user()[settings()->getTokenFieldCode()] : '',
            'expire' => $this->user()[settings()->getTokenExpireFieldCode()] ? $this->user()[settings()->getTokenExpireFieldCode()] : ''
        ];
        journal()->add('request-response', [
            'request' => request()->get(),
            'response' => $response
        ]);
        response()->json($response);
    }

    /**
     * Удалить токен пользователя
     */
    public function delete()
    {
        $user = new CUser();
        $user->update($this->user()['ID'], [
            settings()->getTokenFieldCode() => '',
            settings()->getTokenExpireFieldCode() => ''
        ]);
        $response['successful'] = true;
        journal()->add('request-response', [
            'request' => request()->get(),
            'response' => $response
        ]);
        response()->ok();
    }

    /**
     * Проверка логина и пароля пользователя в базе данных
     * В случае успеха, получаем данные пользователя
     * @return array|false
     * @throws ArgumentException
     * @throws ObjectPropertyException
     * @throws SystemException
     */
    private function user()
    {
        if (!$this->user) {
            $select = [
                'ID',
                'LOGIN',
                'PASSWORD',
                settings()->getTokenFieldCode(),
                settings()->getTokenExpireFieldCode()
            ];
            if (isset(UserTable::getMap()['PASSWORD'])) {
                $user = UserTable::getList(['select' => $select, 'filter' => ['=LOGIN' => request()->get('login')], 'limit' => 1]);
            } else {
                $user = UserTable::getList(['select' => $select, 'filter' => ['=LOGIN' => request()->get('login')], 'private_fields' => ['PASSWORD'], 'limit' => 1]);
            }
            if ($user->getSelectedRowsCount() === 0) {
                journal()->add('request-response', [
                    'request' => request()->get(),
                    'response' => [
                        'error' => 'Login not found'
                    ]
                ]);
                response()->notFound();
            }
            $user = $user->fetchRaw();
            if (!Password::equals($user['LOGIN'], request()->get('password'), $user['PASSWORD'])) {
                journal()->add('request-response', [
                    'request' => request()->get(),
                    'response' => [
                        'error' => 'Invalid password'
                    ]
                ]);
                response()->notFound();
            }
            $this->user = $user;
        }
        return $this->user;
    }
}
