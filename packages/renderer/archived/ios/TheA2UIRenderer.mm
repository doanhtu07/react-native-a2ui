#import "TheA2UIRenderer.h"

@implementation TheA2UIRenderer
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeTheA2UIRendererSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"TheA2UIRenderer";
}

@end
