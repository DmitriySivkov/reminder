<?php

namespace App\Http\Requests;

use Closure;
use App\Models\Group;
use Illuminate\Foundation\Http\FormRequest;

class SyncTasksRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tasks.*.user_id' => [
                'bail',
                'required',
                'exists:users,id',
                function (string $attribute, mixed $value, Closure $fail) {
                    $index = explode('.', $attribute)[1];
                    $task = $this->input('tasks')[$index];

                    if (!$group = Group::where('id', $task['group_id'])->first()) {
                        $fail("The group does not exist");
                        return;
                    }

                    if (!$group->users()->where('id', $value)->exists()) {
                        $fail("The user does not belong to the group");
                    }
                }
            ],
            'tasks.*.owner_id' => [
                'bail',
                'required',
                'exists:users,id'
            ],
            'tasks.*.group_id' => [
                'bail',
                'required',
                'exists:groups,id'
            ],
            'tasks.*.headline' => [
                'bail',
                'required',
                'string'
            ],
            'tasks.*.text' => [
                'bail',
                'required',
                'string',
            ]
        ];
    }
}
