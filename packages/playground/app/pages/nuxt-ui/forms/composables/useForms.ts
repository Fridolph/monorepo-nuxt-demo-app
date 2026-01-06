import * as z from 'zod'
import type { UInputDate, FormSubmitEvent, RadioGroupItem } from '@nuxt/ui'

export default function useForms() {
  const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    sex: z.string('Sex is required'),
    hobbies: z.array(z.string('Hobbies are required')).min(1, 'Must select at least one hobby'),
    color: z.string('Color is required'),
    inputDate: z.date('Date is required')
  })

  const formData = reactive<Partial<ZodSchema>>({
    email: undefined,
    password: undefined,
    sex: undefined,
    hobbies: [],
    color: '#00C16A',
    inputDate: shallowRef({
      start: new Date(2022, 1, 10),
      end: new Date(2022, 1, 20)
    })
  })
  const colorChip = computed(() => ({ backgroundColor: formData.color }))
  const colorText = computed(() => {
    return `Choose color (${formData.color})`
  })

  const inputDateRef = ref<InstanceType<typeof UInputDate> | null>(null)

  const sexList = computed<RadioGroupItem[]>(() => ['Male', 'Female'])

  const hobbyList = computed(() => [
    { label: 'Singing', value: '1' },
    { label: 'Jump', value: '2' },
    { label: 'Rap', value: '3' },
    { label: 'Basketball', value: '4' }
  ])

  const toast = useToast()
  async function onSubmit(event: FormSubmitEvent<ZodSchema>) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log('onSubmit', event.data)
  }

  return {
    // ref
    schema,
    formData,
    // computed
    sexList, hobbyList, colorChip, colorText,
    // fns
    onSubmit,
    // refs
    inputDateRef
  }
}
