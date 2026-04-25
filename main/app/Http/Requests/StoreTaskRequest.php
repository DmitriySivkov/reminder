<?php

namespace App\Http\Requests;

use App\Models\Group;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
            'user_id' => [
                'required',
                'exists:users,id',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (!$group = Group::where('id', $this->input('group_id'))->first()) {
                        $fail("The group does not exist");
                    }

                    if (!$group->users()->where('id', $value)->exists()) {
                        $fail("The user does not belong to the group");
                    }
                },
            ],
            'owner_id' => [
                'required',
                'exists:users,id'
            ],
            'group_id' => [
                'required',
                'exists:groups,id'
            ],
            'headline' => [
                'required',
                'string'
            ],
            'text' => [
                'required',
                'string',
            ]
        ];
    }
}
