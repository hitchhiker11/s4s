<?php

namespace Artamonov\Rest\Controllers\Native;

use Bitrix\Main\Loader;
use CModule;

abstract class BaseController
{
    protected array $errors = [];

    public function __construct()
    {
        $this->validateEnvironment();
        $this->loadDependencies();
    }

    protected function validateEnvironment(): void
    {
        if (!config()->get('useNativeRoute')) {
            $this->errorResponse(403, 'Native routes disabled');
        }
    }

    protected function loadDependencies(): void
    {
        $requiredModules = $this->getRequiredModules();
        foreach ($requiredModules as $module) {
            if (!CModule::IncludeModule($module)) {
                $this->errorResponse(500, "Module {$module} not available");
            }
        }
    }

    abstract protected function getRequiredModules(): array;

    protected function errorResponse(int $code, string $message): void
    {
        response()->json([
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message
            ]
        ], $code);
        exit;
    }
}